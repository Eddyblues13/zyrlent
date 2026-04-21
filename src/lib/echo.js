import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

/**
 * Singleton Laravel Echo instance connected to Reverb (self-hosted websocket).
 *
 * Uses the VITE_ env vars injected at build time:
 *   VITE_REVERB_APP_KEY    = Reverb app key (matches backend .env REVERB_APP_KEY)
 *   VITE_REVERB_HOST       = Host where Reverb is running (e.g. localhost)
 *   VITE_REVERB_PORT       = Port (default 8080)
 *   VITE_REVERB_SCHEME     = http or https
 *
 * The authEndpoint hits /broadcasting/auth on your Laravel backend so Sanctum
 * can verify the private channel subscription.
 */
const echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY ?? 'zyrlent-key',
    wsHost: import.meta.env.VITE_REVERB_HOST ?? 'localhost',
    wsPort: Number(import.meta.env.VITE_REVERB_PORT ?? 8080),
    wssPort: Number(import.meta.env.VITE_REVERB_PORT ?? 8080),
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'http') === 'https',
    enabledTransports: ['ws', 'wss'],
    // Auth endpoint on the backend — must be same origin or CORS-configured
    authEndpoint: `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'}/broadcasting/auth`,
    auth: {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token') ?? ''}`,
            Accept: 'application/json',
        },
    },
});

export default echo;
