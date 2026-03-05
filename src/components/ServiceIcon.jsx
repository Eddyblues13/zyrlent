/**
 * Maps short icon names (stored in DB) → real brand logo URLs.
 * Uses logo.clearbit.com for high-quality brand logos with white backgrounds,
 * falls back to a colored letter square if the name isn't mapped or the image fails to load.
 */
const LOGO_MAP = {
    // Messaging
    whatsapp: 'https://unavatar.io/whatsapp.com',
    telegram: 'https://unavatar.io/telegram.org',
    signal: 'https://unavatar.io/signal.org',
    viber: 'https://unavatar.io/viber.com',
    wechat: 'https://unavatar.io/wechat.com',
    line: 'https://unavatar.io/line.me',

    // Social
    facebook: 'https://unavatar.io/facebook.com',
    instagram: 'https://unavatar.io/instagram.com',
    twitter: 'https://unavatar.io/twitter.com',
    x: 'https://unavatar.io/x.com',
    tiktok: 'https://unavatar.io/tiktok.com',
    snapchat: 'https://unavatar.io/snapchat.com',
    linkedin: 'https://unavatar.io/linkedin.com',
    reddit: 'https://unavatar.io/reddit.com',
    pinterest: 'https://unavatar.io/pinterest.com',
    threads: 'https://unavatar.io/threads.net',

    // Email
    gmail: 'https://unavatar.io/gmail.com',
    yahoo: 'https://unavatar.io/yahoo.com',
    outlook: 'https://unavatar.io/outlook.com',
    protonmail: 'https://unavatar.io/proton.me',

    // Shopping
    amazon: 'https://unavatar.io/amazon.com',
    ebay: 'https://unavatar.io/ebay.com',
    aliexpress: 'https://unavatar.io/aliexpress.com',
    shopify: 'https://unavatar.io/shopify.com',

    // Transport
    uber: 'https://unavatar.io/uber.com',
    lyft: 'https://unavatar.io/lyft.com',
    bolt: 'https://unavatar.io/bolt.eu',
    grab: 'https://unavatar.io/grab.com',

    // Gaming / Entertainment
    discord: 'https://unavatar.io/discord.com',
    steam: 'https://unavatar.io/steampowered.com',
    twitch: 'https://unavatar.io/twitch.tv',
    netflix: 'https://unavatar.io/netflix.com',
    spotify: 'https://unavatar.io/spotify.com',

    // Finance / Crypto
    paypal: 'https://unavatar.io/paypal.com',
    binance: 'https://unavatar.io/binance.com',
    coinbase: 'https://unavatar.io/coinbase.com',
    cashapp: 'https://unavatar.io/cash.app',

    // Tech / Misc
    google: 'https://unavatar.io/google.com',
    apple: 'https://unavatar.io/apple.com',
    microsoft: 'https://unavatar.io/microsoft.com',
    zoom: 'https://unavatar.io/zoom.us',
    dropbox: 'https://unavatar.io/dropbox.com',
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
