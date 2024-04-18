import { delay } from '$lib/delay.js';
import { cachedEmitters } from '$lib/state/cached-emitters.js';
import { cachedKeys } from '$lib/state/cached-keys.js';
import { events } from 'sveltekit-sse';

export async function POST({ request, params }) {
  const { key } = params;

  // This scope here is shared between the beacon requests and the stream request.
  // Don't write anymore logic in here, because it will be executed every T seconds.
  // See https://github.com/tncrazvan/sveltekit-sse?tab=readme-ov-file#beacon for more details.

  return events({
    request,
    async start({ emit, lock }) {
      // This is safe.
      // You can run logic all you want in here.

      const cachedKey = cachedKeys.get(key) ?? false;

      // Remove the key as soon as possible.
      cachedKeys.get(key);

      if (!cachedKey) {
        // Stop the stream if the key is not valid.
        lock.set(false);
        return;
      }

      // ===== IMPORTANT PART STARTS HERE =================================
      // ==================================================================
      // Cache the emitter, so that we can retrieve
      // it when we receive a POST request to "send" (emit) a notification.
      cachedEmitters.set(key, emit);
      // ==================================================================
      // ===== IMPORTANT PART ENDS HERE ===================================

      // Say you're ready.
      emit('ready', 'true');

      // eslint-disable-next-line no-constant-condition
      while (true) {
        emit('message', `some message ${Date.now()}`);
        await delay(2000);
      }
    },
    cancel() {
      // When this stream ends, remove the emitter it cached,
      // so that subsequent notifications POST requests will fail.
      cachedEmitters.get(key);

      // You're telling the third party "hey, this stream doesn't exist anymore".
      // See file src/routes/notifications/[key]/write/+server.js
    }
  });
}
