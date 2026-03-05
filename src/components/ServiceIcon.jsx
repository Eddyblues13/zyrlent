/**
 * Maps short icon names (stored in DB) → real brand logo URLs.
 * Uses logo.clearbit.com for high-quality brand logos with white backgrounds,
 * falls back to a colored letter square if the name isn't mapped or the image fails to load.
 */
const LOGO_MAP = {
    // Messaging
    whatsapp: 'https://logo.clearbit.com/whatsapp.com',
    telegram: 'https://logo.clearbit.com/telegram.org',
    signal: 'https://logo.clearbit.com/signal.org',
    viber: 'https://logo.clearbit.com/viber.com',
    wechat: 'https://logo.clearbit.com/wechat.com',
    line: 'https://logo.clearbit.com/line.me',

    // Social
    facebook: 'https://logo.clearbit.com/facebook.com',
    instagram: 'https://logo.clearbit.com/instagram.com',
    twitter: 'https://logo.clearbit.com/twitter.com',
    x: 'https://logo.clearbit.com/x.com',
    tiktok: 'https://logo.clearbit.com/tiktok.com',
    snapchat: 'https://logo.clearbit.com/snapchat.com',
    linkedin: 'https://logo.clearbit.com/linkedin.com',
    reddit: 'https://logo.clearbit.com/reddit.com',
    pinterest: 'https://logo.clearbit.com/pinterest.com',
    threads: 'https://logo.clearbit.com/threads.net',

    // Email
    gmail: 'https://logo.clearbit.com/gmail.com',
    yahoo: 'https://logo.clearbit.com/yahoo.com',
    outlook: 'https://logo.clearbit.com/outlook.com',
    protonmail: 'https://logo.clearbit.com/proton.me',

    // Shopping
    amazon: 'https://logo.clearbit.com/amazon.com',
    ebay: 'https://logo.clearbit.com/ebay.com',
    aliexpress: 'https://logo.clearbit.com/aliexpress.com',
    shopify: 'https://logo.clearbit.com/shopify.com',

    // Transport
    uber: 'https://logo.clearbit.com/uber.com',
    lyft: 'https://logo.clearbit.com/lyft.com',
    bolt: 'https://logo.clearbit.com/bolt.eu',
    grab: 'https://logo.clearbit.com/grab.com',

    // Gaming / Entertainment
    discord: 'https://logo.clearbit.com/discord.com',
    steam: 'https://logo.clearbit.com/steampowered.com',
    twitch: 'https://logo.clearbit.com/twitch.tv',
    netflix: 'https://logo.clearbit.com/netflix.com',
    spotify: 'https://logo.clearbit.com/spotify.com',

    // Finance / Crypto
    paypal: 'https://logo.clearbit.com/paypal.com',
    binance: 'https://logo.clearbit.com/binance.com',
    coinbase: 'https://logo.clearbit.com/coinbase.com',
    cashapp: 'https://logo.clearbit.com/cash.app',

    // Tech / Misc
    google: 'https://logo.clearbit.com/google.com',
    apple: 'https://logo.clearbit.com/apple.com',
    microsoft: 'https://logo.clearbit.com/microsoft.com',
    zoom: 'https://logo.clearbit.com/zoom.us',
    dropbox: 'https://logo.clearbit.com/dropbox.com',
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
