import { createContext, useContext, useState, useEffect } from 'react'
import api from '../lib/axios'

const CurrencyContext = createContext()

const DEFAULT = {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rateFromUsd: 1,
    rateFromNgn: 1 / 1500,
    loading: true,
}

// IANA timezone → ISO country code
// Timezone is set by the OS and reflects actual location — far more reliable than navigator.language
const TIMEZONE_COUNTRY = {
    'Europe/London': 'GB', 'Europe/Dublin': 'IE', 'Europe/Lisbon': 'PT',
    'Europe/Paris': 'FR', 'Europe/Berlin': 'DE', 'Europe/Rome': 'IT',
    'Europe/Madrid': 'ES', 'Europe/Amsterdam': 'NL', 'Europe/Brussels': 'BE',
    'Europe/Warsaw': 'PL', 'Europe/Stockholm': 'SE', 'Europe/Oslo': 'NO',
    'Europe/Copenhagen': 'DK', 'Europe/Zurich': 'CH', 'Europe/Helsinki': 'FI',
    'Europe/Athens': 'GR', 'Europe/Bucharest': 'RO', 'Europe/Budapest': 'HU',
    'Europe/Prague': 'CZ', 'Europe/Vienna': 'AT', 'Europe/Moscow': 'RU',
    'Europe/Istanbul': 'TR', 'Europe/Kiev': 'UA', 'Europe/Kyiv': 'UA',
    'Africa/Lagos': 'NG', 'Africa/Accra': 'GH', 'Africa/Nairobi': 'KE',
    'Africa/Johannesburg': 'ZA', 'Africa/Dar_es_Salaam': 'TZ', 'Africa/Kampala': 'UG',
    'Africa/Kigali': 'RW', 'Africa/Addis_Ababa': 'ET', 'Africa/Cairo': 'EG',
    'Africa/Abidjan': 'CI', 'Africa/Dakar': 'SN', 'Africa/Bamako': 'ML',
    'Africa/Ouagadougou': 'BF', 'Africa/Lome': 'TG', 'Africa/Cotonou': 'BJ',
    'Africa/Niamey': 'NE', 'Africa/Conakry': 'GN', 'Africa/Luanda': 'AO',
    'Africa/Lusaka': 'ZM', 'Africa/Harare': 'ZW', 'Africa/Blantyre': 'MW',
    'Africa/Maputo': 'MZ', 'Africa/Gaborone': 'BW', 'Africa/Windhoek': 'NA',
    'Africa/Monrovia': 'LR', 'Africa/Freetown': 'SL', 'Africa/Banjul': 'GM',
    'America/New_York': 'US', 'America/Chicago': 'US', 'America/Denver': 'US',
    'America/Los_Angeles': 'US', 'America/Phoenix': 'US', 'America/Anchorage': 'US',
    'Pacific/Honolulu': 'US', 'America/Detroit': 'US', 'America/Indiana/Indianapolis': 'US',
    'America/Toronto': 'CA', 'America/Vancouver': 'CA', 'America/Edmonton': 'CA',
    'America/Winnipeg': 'CA', 'America/Halifax': 'CA', 'America/St_Johns': 'CA',
    'America/Sao_Paulo': 'BR', 'America/Manaus': 'BR', 'America/Belem': 'BR',
    'America/Mexico_City': 'MX', 'America/Monterrey': 'MX', 'America/Cancun': 'MX',
    'Australia/Sydney': 'AU', 'Australia/Melbourne': 'AU', 'Australia/Brisbane': 'AU',
    'Australia/Perth': 'AU', 'Australia/Adelaide': 'AU', 'Australia/Darwin': 'AU',
    'Pacific/Auckland': 'NZ', 'Pacific/Chatham': 'NZ',
    'Asia/Kolkata': 'IN', 'Asia/Calcutta': 'IN',
    'Asia/Karachi': 'PK', 'Asia/Dhaka': 'BD',
    'Asia/Manila': 'PH', 'Asia/Jakarta': 'ID', 'Asia/Makassar': 'ID', 'Asia/Jayapura': 'ID',
    'Asia/Singapore': 'SG', 'Asia/Kuala_Lumpur': 'MY',
    'Asia/Bangkok': 'TH', 'Asia/Ho_Chi_Minh': 'VN', 'Asia/Saigon': 'VN',
    'Asia/Tokyo': 'JP', 'Asia/Shanghai': 'CN', 'Asia/Hong_Kong': 'HK',
    'Asia/Seoul': 'KR', 'Asia/Dubai': 'AE', 'Asia/Riyadh': 'SA',
    'Asia/Tehran': 'IR', 'Asia/Baghdad': 'IQ', 'Asia/Beirut': 'LB',
    'Asia/Colombo': 'LK', 'Asia/Kathmandu': 'NP', 'Asia/Rangoon': 'MM',
    'Asia/Almaty': 'KZ', 'Asia/Tashkent': 'UZ',
    'Pacific/Fiji': 'FJ', 'Pacific/Guam': 'GU',
}

// Detect country code from browser timezone (most reliable client-side signal)
// Falls back to locale region if timezone is not mapped
function getBrowserRegion() {
    try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
        if (tz && TIMEZONE_COUNTRY[tz]) return TIMEZONE_COUNTRY[tz]
    } catch (_) {}

    // Fallback: extract region from locale (e.g. "en-GB" → "GB")
    const locales = navigator.languages?.length ? navigator.languages : [navigator.language]
    for (const locale of locales) {
        const parts = locale.split('-')
        if (parts.length >= 2) return parts[parts.length - 1].toUpperCase()
    }
    return null
}

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState(DEFAULT)

    useEffect(() => {
        const region = getBrowserRegion()
        const params = region ? { hint: region } : {}

        api.get('/api/currency', { params })
            .then(({ data }) => {
                setCurrency({
                    code: data.currency,
                    symbol: data.symbol,
                    name: data.name,
                    rateFromUsd: data.rate_from_usd,
                    rateFromNgn: data.rate_from_ngn,
                    loading: false,
                })
            })
            .catch(() => setCurrency(prev => ({ ...prev, loading: false })))
    }, [])

    // Format an NGN-stored amount (wallet balance, transaction, order cost)
    const formatNGN = (ngnAmount) => {
        const converted = (parseFloat(ngnAmount) || 0) * currency.rateFromNgn
        return new Intl.NumberFormat('en', {
            style: 'currency',
            currency: currency.code,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(converted)
    }

    // Format a USD-sourced amount (provider prices)
    const formatUSD = (usdAmount) => {
        const converted = (parseFloat(usdAmount) || 0) * currency.rateFromUsd
        return new Intl.NumberFormat('en', {
            style: 'currency',
            currency: currency.code,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(converted)
    }

    return (
        <CurrencyContext.Provider value={{ currency, formatNGN, formatUSD }}>
            {children}
        </CurrencyContext.Provider>
    )
}

export const useCurrency = () => useContext(CurrencyContext)
