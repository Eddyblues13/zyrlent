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
    imo: 'https://www.google.com/s2/favicons?domain=imo.im&sz=128',
    kakaotalk: 'https://cdn.simpleicons.org/kakaotalk/FFE812',
    kakao: 'https://cdn.simpleicons.org/kakaotalk/FFE812',

    // Social
    facebook: 'https://cdn.simpleicons.org/facebook/1877F2',
    instagram: 'https://cdn.simpleicons.org/instagram/E4405F',
    twitter: 'https://cdn.simpleicons.org/twitter/1DA1F2',
    x: 'https://cdn.simpleicons.org/x/FFFFFF',
    tiktok: 'https://cdn.simpleicons.org/tiktok/FF0050',
    snapchat: 'https://cdn.simpleicons.org/snapchat/FFFC00',
    linkedin: 'https://cdn.simpleicons.org/linkedin/0A66C2',
    reddit: 'https://cdn.simpleicons.org/reddit/FF4500',
    pinterest: 'https://cdn.simpleicons.org/pinterest/BD081C',
    threads: 'https://cdn.simpleicons.org/threads/FFFFFF',
    vk: 'https://cdn.simpleicons.org/vk/0077FF',
    ok: 'https://cdn.simpleicons.org/odnoklassniki/EE8208',
    odnoklassniki: 'https://cdn.simpleicons.org/odnoklassniki/EE8208',
    badoo: 'https://cdn.simpleicons.org/badoo/FF7343',
    tinder: 'https://cdn.simpleicons.org/tinder/FF6B6B',
    bumble: 'https://cdn.simpleicons.org/bumble/FFC629',
    hinge: 'https://www.google.com/s2/favicons?domain=hinge.co&sz=128',
    tagged: 'https://www.google.com/s2/favicons?domain=tagged.com&sz=128',
    weibo: 'https://cdn.simpleicons.org/sinaweibo/E6162D',

    // Email
    gmail: 'https://cdn.simpleicons.org/gmail/EA4335',
    google: 'https://cdn.simpleicons.org/google/4285F4',
    yahoo: 'https://cdn.simpleicons.org/yahoo/6001D2',
    outlook: 'https://cdn.simpleicons.org/microsoftoutlook/0078D4',
    protonmail: 'https://cdn.simpleicons.org/protonmail/6D4AFF',
    mail: 'https://cdn.simpleicons.org/maildotru/FF6600',
    mailru: 'https://cdn.simpleicons.org/maildotru/FF6600',
    'mail.ru': 'https://cdn.simpleicons.org/maildotru/FF6600',
    yandex: 'https://cdn.simpleicons.org/yandex/FF0000',

    // Shopping
    amazon: 'https://cdn.simpleicons.org/amazon/FF9900',
    ebay: 'https://cdn.simpleicons.org/ebay/E53238',
    aliexpress: 'https://cdn.simpleicons.org/aliexpress/FF4747',
    alibaba: 'https://cdn.simpleicons.org/alibabadotcom/FF6A00',
    shopify: 'https://cdn.simpleicons.org/shopify/7AB55C',
    shopee: 'https://cdn.simpleicons.org/shopee/EE4D2D',
    lazada: 'https://www.google.com/s2/favicons?domain=lazada.com&sz=128',
    walmart: 'https://cdn.simpleicons.org/walmart/0071CE',
    nike: 'https://cdn.simpleicons.org/nike/FFFFFF',
    adidas: 'https://cdn.simpleicons.org/adidas/FFFFFF',
    zara: 'https://cdn.simpleicons.org/zara/FFFFFF',
    shein: 'https://cdn.simpleicons.org/shein/FFFFFF',
    wish: 'https://www.google.com/s2/favicons?domain=wish.com&sz=128',
    temu: 'https://www.google.com/s2/favicons?domain=temu.com&sz=128',
    etsy: 'https://cdn.simpleicons.org/etsy/F16521',
    mercari: 'https://www.google.com/s2/favicons?domain=mercari.com&sz=128',
    flipkart: 'https://cdn.simpleicons.org/flipkart/2874F0',
    rakuten: 'https://cdn.simpleicons.org/rakuten/BF0000',
    wildberries: 'https://www.google.com/s2/favicons?domain=wildberries.ru&sz=128',
    ozon: 'https://www.google.com/s2/favicons?domain=ozon.ru&sz=128',
    avito: 'https://www.google.com/s2/favicons?domain=avito.ru&sz=128',

    // Transport / Delivery
    uber: 'https://cdn.simpleicons.org/uber/FFFFFF',
    lyft: 'https://cdn.simpleicons.org/lyft/FF00BF',
    bolt: 'https://cdn.simpleicons.org/bolt/34D186',
    grab: 'https://cdn.simpleicons.org/grab/00B14F',
    gojek: 'https://cdn.simpleicons.org/gojek/00AA13',
    careem: 'https://www.google.com/s2/favicons?domain=careem.com&sz=128',
    yandextaxi: 'https://cdn.simpleicons.org/yandex/FF0000',
    didi: 'https://www.google.com/s2/favicons?domain=didiglobal.com&sz=128',
    doordash: 'https://cdn.simpleicons.org/doordash/FF3008',
    ubereats: 'https://cdn.simpleicons.org/ubereats/06C167',
    deliveroo: 'https://cdn.simpleicons.org/deliveroo/00CCBC',
    foodpanda: 'https://www.google.com/s2/favicons?domain=foodpanda.com&sz=128',
    grubhub: 'https://cdn.simpleicons.org/grubhub/F63440',
    instacart: 'https://cdn.simpleicons.org/instacart/43B02A',

    // Gaming / Entertainment
    discord: 'https://cdn.simpleicons.org/discord/5865F2',
    steam: 'https://cdn.simpleicons.org/steam/FFFFFF',
    twitch: 'https://cdn.simpleicons.org/twitch/9146FF',
    netflix: 'https://cdn.simpleicons.org/netflix/E50914',
    spotify: 'https://cdn.simpleicons.org/spotify/1DB954',
    youtube: 'https://cdn.simpleicons.org/youtube/FF0000',
    roblox: 'https://cdn.simpleicons.org/roblox/FFFFFF',
    epicgames: 'https://cdn.simpleicons.org/epicgames/FFFFFF',
    epic: 'https://cdn.simpleicons.org/epicgames/FFFFFF',
    playstation: 'https://cdn.simpleicons.org/playstation/003791',
    xbox: 'https://cdn.simpleicons.org/xbox/107C10',
    nintendo: 'https://cdn.simpleicons.org/nintendo/E60012',
    battlenet: 'https://cdn.simpleicons.org/battledotnet/148EFF',
    origin: 'https://cdn.simpleicons.org/origin/F56C2D',
    ea: 'https://cdn.simpleicons.org/ea/FFFFFF',
    supercell: 'https://www.google.com/s2/favicons?domain=supercell.com&sz=128',
    garena: 'https://www.google.com/s2/favicons?domain=garena.com&sz=128',
    pubg: 'https://www.google.com/s2/favicons?domain=pubg.com&sz=128',
    fortnite: 'https://cdn.simpleicons.org/epicgames/FFFFFF',
    deezer: 'https://cdn.simpleicons.org/deezer/FEAA2D',
    hulu: 'https://cdn.simpleicons.org/hulu/1CE783',
    disneyplus: 'https://www.google.com/s2/favicons?domain=disneyplus.com&sz=128',
    disney: 'https://www.google.com/s2/favicons?domain=disneyplus.com&sz=128',
    hbomax: 'https://www.google.com/s2/favicons?domain=max.com&sz=128',
    primevideo: 'https://cdn.simpleicons.org/primevideo/1A98FF',
    tidal: 'https://cdn.simpleicons.org/tidal/FFFFFF',

    // Finance / Crypto
    paypal: 'https://cdn.simpleicons.org/paypal/00457C',
    binance: 'https://cdn.simpleicons.org/binance/F0B90B',
    coinbase: 'https://cdn.simpleicons.org/coinbase/0052FF',
    cashapp: 'https://cdn.simpleicons.org/cashapp/00C244',
    wise: 'https://cdn.simpleicons.org/wise/9FE870',
    revolut: 'https://cdn.simpleicons.org/revolut/FFFFFF',
    stripe: 'https://cdn.simpleicons.org/stripe/635BFF',
    venmo: 'https://www.google.com/s2/favicons?domain=venmo.com&sz=128',
    skrill: 'https://cdn.simpleicons.org/skrill/862165',
    neteller: 'https://www.google.com/s2/favicons?domain=neteller.com&sz=128',
    paysafecard: 'https://cdn.simpleicons.org/paysafecard/00456A',
    qiwi: 'https://www.google.com/s2/favicons?domain=qiwi.com&sz=128',
    webmoney: 'https://cdn.simpleicons.org/webmoney/036CB5',
    alipay: 'https://cdn.simpleicons.org/alipay/1677FF',
    wepay: 'https://www.google.com/s2/favicons?domain=wepay.com&sz=128',
    crypto: 'https://cdn.simpleicons.org/bitcoin/F7931A',
    bybit: 'https://www.google.com/s2/favicons?domain=bybit.com&sz=128',
    kraken: 'https://cdn.simpleicons.org/kraken/5741D9',
    okx: 'https://www.google.com/s2/favicons?domain=okx.com&sz=128',
    kucoin: 'https://www.google.com/s2/favicons?domain=kucoin.com&sz=128',

    // Tech / Productivity
    apple: 'https://cdn.simpleicons.org/apple/FFFFFF',
    microsoft: 'https://cdn.simpleicons.org/microsoft/FFFFFF',
    zoom: 'https://cdn.simpleicons.org/zoom/0B5CFF',
    dropbox: 'https://cdn.simpleicons.org/dropbox/0061FF',
    slack: 'https://cdn.simpleicons.org/slack/4A154B',
    notion: 'https://cdn.simpleicons.org/notion/FFFFFF',
    github: 'https://cdn.simpleicons.org/github/FFFFFF',
    gitlab: 'https://cdn.simpleicons.org/gitlab/FC6D26',
    openai: 'https://cdn.simpleicons.org/openai/FFFFFF',
    chatgpt: 'https://cdn.simpleicons.org/openai/FFFFFF',
    adobe: 'https://cdn.simpleicons.org/adobe/FF0000',
    canva: 'https://cdn.simpleicons.org/canva/00C4CC',
    figma: 'https://cdn.simpleicons.org/figma/F24E1E',
    trello: 'https://cdn.simpleicons.org/trello/0052CC',
    asana: 'https://cdn.simpleicons.org/asana/F06A6A',
    atlassian: 'https://cdn.simpleicons.org/atlassian/0052CC',
    jira: 'https://cdn.simpleicons.org/jira/0052CC',
    evernote: 'https://cdn.simpleicons.org/evernote/00A82D',
    icloud: 'https://cdn.simpleicons.org/icloud/3693F3',

    // Travel / Accommodation
    airbnb: 'https://cdn.simpleicons.org/airbnb/FF5A5F',
    booking: 'https://cdn.simpleicons.org/bookingdotcom/003580',
    tripadvisor: 'https://cdn.simpleicons.org/tripadvisor/34E0A1',
    expedia: 'https://www.google.com/s2/favicons?domain=expedia.com&sz=128',
    kayak: 'https://www.google.com/s2/favicons?domain=kayak.com&sz=128',

    // Telecom / VPN
    t_mobile: 'https://cdn.simpleicons.org/tmobile/E20074',
    tmobile: 'https://cdn.simpleicons.org/tmobile/E20074',
    att: 'https://www.google.com/s2/favicons?domain=att.com&sz=128',
    verizon: 'https://www.google.com/s2/favicons?domain=verizon.com&sz=128',
    vodafone: 'https://cdn.simpleicons.org/vodafone/E60000',
    nordvpn: 'https://cdn.simpleicons.org/nordvpn/4687FF',
    expressvpn: 'https://www.google.com/s2/favicons?domain=expressvpn.com&sz=128',
    surfshark: 'https://www.google.com/s2/favicons?domain=surfshark.com&sz=128',

    // Other popular 5sim services
    naver: 'https://cdn.simpleicons.org/naver/03C75A',
    daum: 'https://www.google.com/s2/favicons?domain=daum.net&sz=128',
    zalo: 'https://www.google.com/s2/favicons?domain=zalo.me&sz=128',
    olx: 'https://www.google.com/s2/favicons?domain=olx.com&sz=128',
    leboncoin: 'https://www.google.com/s2/favicons?domain=leboncoin.fr&sz=128',
    craigslist: 'https://www.google.com/s2/favicons?domain=craigslist.org&sz=128',
    blizzard: 'https://cdn.simpleicons.org/blizzardentertainment/148EFF',
    clubhouse: 'https://www.google.com/s2/favicons?domain=clubhouse.com&sz=128',
    tango: 'https://www.google.com/s2/favicons?domain=tango.me&sz=128',
    truecaller: 'https://www.google.com/s2/favicons?domain=truecaller.com&sz=128',
    textme: 'https://www.google.com/s2/favicons?domain=textme.com&sz=128',
    textnow: 'https://www.google.com/s2/favicons?domain=textnow.com&sz=128',
    talkatone: 'https://www.google.com/s2/favicons?domain=talkatone.com&sz=128',
    pof: 'https://www.google.com/s2/favicons?domain=pof.com&sz=128',
    match: 'https://www.google.com/s2/favicons?domain=match.com&sz=128',
    okcupid: 'https://www.google.com/s2/favicons?domain=okcupid.com&sz=128',
    happn: 'https://www.google.com/s2/favicons?domain=happn.com&sz=128',
    grindr: 'https://www.google.com/s2/favicons?domain=grindr.com&sz=128',
    proton: 'https://cdn.simpleicons.org/proton/6D4AFF',
    mega: 'https://cdn.simpleicons.org/mega/D9272E',
    onedrive: 'https://cdn.simpleicons.org/microsoftonedrive/0078D4',
    telegram_login: 'https://cdn.simpleicons.org/telegram/26A5E4',
    whatsapp_business: 'https://cdn.simpleicons.org/whatsapp/25D366',
    facebook_messenger: 'https://cdn.simpleicons.org/messenger/00B2FF',
    messenger: 'https://cdn.simpleicons.org/messenger/00B2FF',
    skype: 'https://cdn.simpleicons.org/skype/00AFF0',
    teams: 'https://cdn.simpleicons.org/microsoftteams/6264A7',
    webex: 'https://cdn.simpleicons.org/webex/000000',
    fiverr: 'https://cdn.simpleicons.org/fiverr/1DBF73',
    upwork: 'https://cdn.simpleicons.org/upwork/14A800',
    freelancer: 'https://www.google.com/s2/favicons?domain=freelancer.com&sz=128',
    coinmarketcap: 'https://www.google.com/s2/favicons?domain=coinmarketcap.com&sz=128',
    blockchain: 'https://www.google.com/s2/favicons?domain=blockchain.com&sz=128',
    gopuff: 'https://www.google.com/s2/favicons?domain=gopuff.com&sz=128',
    postmates: 'https://www.google.com/s2/favicons?domain=postmates.com&sz=128',
    rappi: 'https://www.google.com/s2/favicons?domain=rappi.com&sz=128',
    glovo: 'https://www.google.com/s2/favicons?domain=glovoapp.com&sz=128',
    swiggy: 'https://www.google.com/s2/favicons?domain=swiggy.com&sz=128',
    zomato: 'https://cdn.simpleicons.org/zomato/E23744',
    ticketmaster: 'https://www.google.com/s2/favicons?domain=ticketmaster.com&sz=128',
    eventbrite: 'https://cdn.simpleicons.org/eventbrite/F05537',
    meetup: 'https://cdn.simpleicons.org/meetup/ED1C40',
    duolingo: 'https://cdn.simpleicons.org/duolingo/58CC02',
    coursera: 'https://cdn.simpleicons.org/coursera/0056D2',
    udemy: 'https://cdn.simpleicons.org/udemy/A435F0',
    quora: 'https://cdn.simpleicons.org/quora/B92B27',
    tumblr: 'https://cdn.simpleicons.org/tumblr/36465D',
    flickr: 'https://cdn.simpleicons.org/flickr/0063DC',
    weverse: 'https://www.google.com/s2/favicons?domain=weverse.io&sz=128',
    strava: 'https://cdn.simpleicons.org/strava/FC4C02',
    nike_run: 'https://cdn.simpleicons.org/nike/FFFFFF',
    peloton: 'https://cdn.simpleicons.org/peloton/FFFFFF',
    ticktick: 'https://www.google.com/s2/favicons?domain=ticktick.com&sz=128',
    todoist: 'https://cdn.simpleicons.org/todoist/E44332',
    any: 'https://cdn.simpleicons.org/simpleicons/FFFFFF',
    other: 'https://cdn.simpleicons.org/simpleicons/FFFFFF',
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
        // Known icon CDNs — these are already valid image URLs, use directly
        try {
            const url = new URL(icon)
            const host = url.hostname

            // SimpleIcons CDN (e.g. https://cdn.simpleicons.org/whatsapp/25D366)
            if (host === 'cdn.simpleicons.org') return icon

            // Google Favicons (e.g. https://www.google.com/s2/favicons?domain=...)
            if (host.endsWith('google.com') && url.pathname.includes('/s2/favicons')) return icon

            // Old clearbit URLs stored in DB
            const clearbitName = extractNameFromClearbitUrl(icon)
            if (clearbitName) {
                return LOGO_MAP[clearbitName] || `https://www.google.com/s2/favicons?domain=${clearbitName}.com&sz=128`
            }

            const path = url.pathname.replace(/\/+$/, '')

            // Check if it points to an actual image file
            const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico']
            const hasImageExt = imageExtensions.some(ext => path.toLowerCase().endsWith(ext))

            if (hasImageExt) {
                return icon // It's a real image URL, use it directly
            }

            // It's a bare domain URL — try to match by hostname
            const domainName = host.replace(/^www\./, '').replace(/\.[^.]+$/, '')
            if (LOGO_MAP[domainName]) {
                return LOGO_MAP[domainName]
            }

            // Final fallback: use Google Favicon for unknown domains
            return `https://www.google.com/s2/favicons?domain=${host}&sz=128`
        } catch {
            return null
        }
    }

    // Short name lookup — try exact match, then try with common suffixes stripped
    const lower = icon.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (LOGO_MAP[lower]) return LOGO_MAP[lower]

    // Try original lowercase
    if (LOGO_MAP[icon.toLowerCase()]) return LOGO_MAP[icon.toLowerCase()]

    // For unknown short names, try Google favicon as last resort
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(icon.toLowerCase())}.com&sz=128`
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
