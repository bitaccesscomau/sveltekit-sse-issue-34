import { cachedEmitters } from '$lib/state/cached-emitters.js';
import { error } from '@sveltejs/kit';

export async function POST({ request, params }) {
  const { key } = params;
  /**
   * @type {{message:string}}
   */
  const { message } = await request.json();

  // Unlike the "read" case, this is just a normal POST request,
  // this scope is not shared with any beacons.
  // You can write all the logic you want in here.

  // ===== IMPORTANT PART STARTS HERE =====
  // ======================================
  // Retrieve the emitter to use.
  const emit = cachedEmitters.get(key);
  if (!emit) {
    error(401, 'Unauthorized, provided emitter key is not valid.');
  }
  // Send the notification.
  emit('message', message);
  // ======================================
  // ===== IMPORTANT PART ENDS HERE =======

  // Tell the caller everything is ok (200).
  return new Response();
}
