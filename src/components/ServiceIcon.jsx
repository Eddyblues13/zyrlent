/**
 * Maps short icon names (stored in DB) → real colored brand logo URLs.
 * Uses cdn.simpleicons.org for high-quality colored SVG brand logos,
 * falls back to a colored letter square if the name isn't mapped or the image fails to load.
 */
const LOGO_MAP = {
    // Messaging
    whatsapp: 'https://cdn.simpleicons.org/whatsapp/25D366',
    telegram: 'https://cdn.simpleicons.org/telegram/26A5E4',
    signal: 'https://cdn.simpleicons.org/signal/3A76F0',
    viber: 'https://cdn.simpleicons.org/viber/7360F2',
    wechat: 'https://cdn.simpleicons.org/wechat/07C160',
    line: 'https://cdn.simpleicons.org/line/00C300',

    // Social
    facebook: 'https://cdn.simpleicons.org/facebook/1877F2',
    instagram: 'https://cdn.simpleicons.org/instagram/E4405F',
    twitter: 'https://cdn.simpleicons.org/twitter/1DA1F2',
    x: 'https://cdn.simpleicons.org/x/FFFFFF',
    tiktok: 'https://cdn.simpleicons.org/tiktok/FF0050',
    snapchat: 'https://cdn.simpleicons.org/snapchat/FFFC00',
    linkedin: 'https://www.google.com/s2/favicons?domain=linkedin.com&sz=128',
    reddit: 'https://cdn.simpleicons.org/reddit/FF4500',
    pinterest: 'https://cdn.simpleicons.org/pinterest/BD081C',
    threads: 'https://cdn.simpleicons.org/threads/FFFFFF',

    // Email
    gmail: 'https://cdn.simpleicons.org/gmail/EA4335',
    yahoo: 'https://www.google.com/s2/favicons?domain=yahoo.com&sz=128',
    outlook: 'https://cdn.simpleicons.org/microsoftoutlook/0078D4',
    protonmail: 'https://cdn.simpleicons.org/protonmail/6D4AFF',

    // Shopping
    amazon: 'https://www.google.com/s2/favicons?domain=amazon.com&sz=128',
    ebay: 'https://cdn.simpleicons.org/ebay/E53238',
    aliexpress: 'https://cdn.simpleicons.org/aliexpress/FF4747',
    shopify: 'https://cdn.simpleicons.org/shopify/7AB55C',

    // Transport
    uber: 'https://cdn.simpleicons.org/uber/FFFFFF',
    lyft: 'https://cdn.simpleicons.org/lyft/FF00BF',
    bolt: 'https://cdn.simpleicons.org/bolt/34D186',
    grab: 'https://cdn.simpleicons.org/grab/00B14F',

    // Gaming / Entertainment
    discord: 'https://cdn.simpleicons.org/discord/5865F2',
    steam: 'https://cdn.simpleicons.org/steam/FFFFFF',
    twitch: 'https://cdn.simpleicons.org/twitch/9146FF',
    netflix: 'https://cdn.simpleicons.org/netflix/E50914',
    spotify: 'https://cdn.simpleicons.org/spotify/1DB954',

    // Finance / Crypto
    paypal: 'https://cdn.simpleicons.org/paypal/00457C',
    binance: 'https://cdn.simpleicons.org/binance/F0B90B',
    coinbase: 'https://cdn.simpleicons.org/coinbase/0052FF',
    cashapp: 'https://cdn.simpleicons.org/cashapp/00C244',

    // Tech / Misc
    google: 'https://cdn.simpleicons.org/google/4285F4',
    apple: 'https://cdn.simpleicons.org/apple/FFFFFF',
    microsoft: 'https://www.google.com/s2/favicons?domain=microsoft.com&sz=128',
    zoom: 'https://cdn.simpleicons.org/zoom/0B5CFF',
    dropbox: 'https://cdn.simpleicons.org/dropbox/0061FF',
}

/**
 * Extracts a usable domain from a clearbit-style URL.
 * e.g. "https://logo.clearbit.com/whatsapp.com" → "whatsapp"
 */
function extractNameFromClearbitUrl(url) {
    try {
        const parsed = new URL(url)
        if (parsed.hostname === 'logo.clearbit.com') {
            // The path is like /whatsapp.com — extract the name part
            const domain = parsed.pathname.replace(/^\/+/, '').replace(/\.[^.]+$/, '')
            return domain.toLowerCase()
        }
    } catch { /* ignore */ }
    return null
}

/**
 * Resolves an icon value to a logo URL.
 * Handles:
 * 1. Clearbit URLs from DB (https://logo.clearbit.com/domain.com) → converted to LOGO_MAP lookup
 * 2. Actual image URLs (.png, .jpg, etc.) → used directly
 * 3. Bare domain URLs (https://whatsapp.com) → converted to Simple Icons
 * 4. Short names (whatsapp, telegram) → looked up in LOGO_MAP
 */
export function resolveServiceLogo(icon) {
    if (!icon) return null

    // If it's a full URL
    if (icon.startsWith('http://') || icon.startsWith('https://')) {
        // Special handling for old clearbit URLs stored in DB
        const clearbitName = extractNameFromClearbitUrl(icon)
        if (clearbitName) {
            return LOGO_MAP[clearbitName] || null
        }

        try {
            const url = new URL(icon)
            const path = url.pathname.replace(/\/+$/, '')

            // Check if it points to an actual image file
            const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico']
            const hasImageExt = imageExtensions.some(ext => path.toLowerCase().endsWith(ext))

            if (hasImageExt) {
                return icon // It's a real image URL, use it directly
            }

            // It's a bare domain URL — try to match by hostname
            const domainName = url.hostname.replace(/^www\./, '').replace(/\.[^.]+$/, '')
            if (LOGO_MAP[domainName]) {
                return LOGO_MAP[domainName]
            }

            // Final fallback: use Google Favicon for unknown domains
            return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=128`
        } catch {
            return null
        }
    }

    return LOGO_MAP[icon.toLowerCase()] || null
}

/**
 * Reusable ServiceIcon — renders the actual logo image if icon is a URL or
 * a known brand name, otherwise falls back to a colored letter square.
 */
export default function ServiceIcon({ icon, name, color, size = 'md' }) {
    const logoUrl = resolveServiceLogo(icon)
    const sizes = { sm: 'w-6 h-6', md: 'w-8 h-8', lg: 'w-10 h-10' }
    const textSizes = { sm: 'text-[9px]', md: 'text-xs', lg: 'text-sm' }
    const sizeClass = sizes[size] || sizes.md

    if (logoUrl) {
        return (
            <img
                src={logoUrl}
                alt={name || ''}
                className={`${sizeClass} rounded-lg object-contain bg-white/10 p-0.5 flex-shrink-0`}
                onError={(e) => {
                    // Fallback to letter square on load error
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                }}
            />
        )
    }

    return (
        <div
            className={`${sizeClass} rounded-lg flex-shrink-0 flex items-center justify-center ${textSizes[size]} font-bold text-white`}
            style={{ backgroundColor: color || '#555' }}
        >
            {name?.[0]?.toUpperCase() || '?'}
        </div>
    )
}

/**
 * Combo: tries img first, with hidden fallback div.
 */
export function ServiceIconWithFallback({ icon, name, color, size = 'md' }) {
    const logoUrl = resolveServiceLogo(icon)
    const sizes = { sm: 'w-6 h-6', md: 'w-8 h-8', lg: 'w-10 h-10' }
    const textSizes = { sm: 'text-[9px]', md: 'text-xs', lg: 'text-sm' }
    const sizeClass = sizes[size] || sizes.md

    if (!logoUrl) {
        return (
            <div className={`${sizeClass} rounded-lg flex-shrink-0 flex items-center justify-center ${textSizes[size]} font-bold text-white`}
                style={{ backgroundColor: color || '#555' }}>
                {name?.[0]?.toUpperCase() || '?'}
            </div>
        )
    }

    return (
        <span className="relative inline-block flex-shrink-0">
            <img src={logoUrl} alt={name || ''} className={`${sizeClass} rounded-lg object-contain bg-white/10 p-0.5`}
                onError={(e) => { e.target.style.display = 'none'; if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'flex' }}
            />
            <div className={`${sizeClass} rounded-lg items-center justify-center ${textSizes[size]} font-bold text-white absolute inset-0 hidden`}
                style={{ backgroundColor: color || '#555' }}>
                {name?.[0]?.toUpperCase() || '?'}
            </div>
        </span>
    )
}
