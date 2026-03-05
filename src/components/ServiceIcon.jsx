/**
 * Maps short icon names (stored in DB) → real brand logo URLs.
 * Uses logo.clearbit.com for high-quality brand logos with white backgrounds,
 * falls back to a colored letter square if the name isn't mapped or the image fails to load.
 */
const LOGO_MAP = {
    // Messaging
    whatsapp: 'https://icon.horse/icon/whatsapp.com',
    telegram: 'https://icon.horse/icon/telegram.org',
    signal: 'https://icon.horse/icon/signal.org',
    viber: 'https://icon.horse/icon/viber.com',
    wechat: 'https://icon.horse/icon/wechat.com',
    line: 'https://icon.horse/icon/line.me',

    // Social
    facebook: 'https://icon.horse/icon/facebook.com',
    instagram: 'https://icon.horse/icon/instagram.com',
    twitter: 'https://icon.horse/icon/twitter.com',
    x: 'https://icon.horse/icon/x.com',
    tiktok: 'https://icon.horse/icon/tiktok.com',
    snapchat: 'https://icon.horse/icon/snapchat.com',
    linkedin: 'https://icon.horse/icon/linkedin.com',
    reddit: 'https://icon.horse/icon/reddit.com',
    pinterest: 'https://icon.horse/icon/pinterest.com',
    threads: 'https://icon.horse/icon/threads.net',

    // Email
    gmail: 'https://icon.horse/icon/gmail.com',
    yahoo: 'https://icon.horse/icon/yahoo.com',
    outlook: 'https://icon.horse/icon/outlook.com',
    protonmail: 'https://icon.horse/icon/proton.me',

    // Shopping
    amazon: 'https://icon.horse/icon/amazon.com',
    ebay: 'https://icon.horse/icon/ebay.com',
    aliexpress: 'https://icon.horse/icon/aliexpress.com',
    shopify: 'https://icon.horse/icon/shopify.com',

    // Transport
    uber: 'https://icon.horse/icon/uber.com',
    lyft: 'https://icon.horse/icon/lyft.com',
    bolt: 'https://icon.horse/icon/bolt.eu',
    grab: 'https://icon.horse/icon/grab.com',

    // Gaming / Entertainment
    discord: 'https://icon.horse/icon/discord.com',
    steam: 'https://icon.horse/icon/steampowered.com',
    twitch: 'https://icon.horse/icon/twitch.tv',
    netflix: 'https://icon.horse/icon/netflix.com',
    spotify: 'https://icon.horse/icon/spotify.com',

    // Finance / Crypto
    paypal: 'https://icon.horse/icon/paypal.com',
    binance: 'https://icon.horse/icon/binance.com',
    coinbase: 'https://icon.horse/icon/coinbase.com',
    cashapp: 'https://icon.horse/icon/cash.app',

    // Tech / Misc
    google: 'https://icon.horse/icon/google.com',
    apple: 'https://icon.horse/icon/apple.com',
    microsoft: 'https://icon.horse/icon/microsoft.com',
    zoom: 'https://icon.horse/icon/zoom.us',
    dropbox: 'https://icon.horse/icon/dropbox.com',
}

/**
 * Resolves an icon value to a logo URL.
 * If icon is already a URL, returns it as-is.
 * If it's a short name, looks up in LOGO_MAP.
 * Returns null if no match found.
 */
export function resolveServiceLogo(icon) {
    if (!icon) return null
    if (icon.startsWith('http://') || icon.startsWith('https://')) return icon
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
