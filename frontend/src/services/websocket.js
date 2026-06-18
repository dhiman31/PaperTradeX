/**
 * websocket.js
 *
 * Manages WebSocket connections. Both endpoints are public (no auth):
 *   WS_BASE/home   → same ticker protocol as /market (see utils/ticker.js)
 *   WS_BASE/market → live symbol ticker data
 *
 * Usage:
 *   const ws = createWsConnection('/home', onMessage, onError);
 *   ws.close(); // cleanup
 */

const WS_BASE = import.meta.env.VITE_WS_BASE_URL ?? `ws://${window.location.host}`;

/**
 * @param {string} path - '/home' or '/market'
 * @param {(data: any) => void} onMessage
 * @param {(err: Event) => void} [onError]
 * @returns {{ close: () => void }}
 */
export function createWsConnection(path, onMessage, onError) {
  const socket = new WebSocket(`${WS_BASE}${path}`);

  socket.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch {
      onMessage(event.data);
    }
  });

  socket.addEventListener('error', (err) => {
    onError?.(err);
  });

  return {
    close: () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
    },
  };
}
