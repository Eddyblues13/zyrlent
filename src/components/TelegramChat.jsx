const TELEGRAM_URL = 'https://t.me/zyrlent'

export default function TelegramChat() {
    return (
        <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on Telegram"
            className="fixed bottom-20 right-4 z-[60] group md:bottom-8 md:right-8"
        >
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-[#0088cc] animate-ping opacity-20 group-hover:opacity-30" />

            {/* Button */}
            <div className="relative flex items-center gap-2 rounded-full bg-gradient-to-br from-[#0088cc] to-[#0066aa] text-white shadow-[0_4px_24px_rgba(0,136,204,0.45)] hover:shadow-[0_4px_32px_rgba(0,136,204,0.65)] hover:scale-105 transition-all duration-200 px-4 py-3 sm:px-5 sm:py-3.5">
                {/* Telegram SVG icon */}
                <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                <span className="text-sm font-bold hidden sm:inline">Live Chat</span>
            </div>
        </a>
    )
}
