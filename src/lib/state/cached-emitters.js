/**
 * @type {Map<string, (eventName: string, data: string) => import('sveltekit-sse').Unsafe<void>>}
 */
export const cachedEmitters = new Map();
