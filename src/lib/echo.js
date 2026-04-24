import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

/**
 * Laravel Echo instance for real-time OTP push notifications.
 *
 * In production on shared hosting (cPanel), Reverb WebSocket is NOT available.
 * The app gracefully falls back to HTTP polling (every 2s) for OTP detection.
 * This Echo instance will silently fail to connect — that's expected and fine.
 *
 * If you ever move to a VPS/dedicated server, you can run `php artisan reverb:start`
 * and this will automatically start working for instant push notifications.
 */

let echo;

try {
    const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
    const reverbHost = import.meta.env.VITE_REVERB_HOST ?? '';
    const reverbKey = import.meta.env.VITE_REVERB_APP_KEY ?? '';

    // Only create Echo if Reverb is configured (has a host and key)
    if (reverbHost && reverbKey) {
        echo = new Echo({
            broadcaster: 'reverb',
            key: reverbKey,
            wsHost: reverbHost,
            wsPort: Number(import.meta.env.VITE_REVERB_PORT ?? 8080),
            wssPort: Number(import.meta.env.VITE_REVERB_PORT ?? 443),
            forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'http') === 'https',
            enabledTransports: ['ws', 'wss'],
            authEndpoint: `${apiBase}/broadcasting/auth`,
            auth: {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token') ?? ''}`,
                    Accept: 'application/json',
                },
            },
        });
    } else {
        // No Reverb configured — create a no-op stub so code doesn't break
        echo = {
            private: () => ({ listen: () => ({ listen: () => ({}) }) }),
            leave: () => {},
            options: { auth: { headers: {} } },
        };
        console.info('[Echo] Reverb not configured — using HTTP polling only.');
    }
} catch (err) {
    console.warn('[Echo] Failed to initialize WebSocket — falling back to HTTP polling:', err.message);
    // No-op stub so the rest of the app doesn't crash
    echo = {
        private: () => ({ listen: () => ({ listen: () => ({}) }) }),
        leave: () => {},
        options: { auth: { headers: {} } },
    };
}

export default echo;
