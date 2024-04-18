import { cachedKeys } from '$lib/state/cached-keys';
import { uuid } from '$lib/uuid';

export async function GET() {
  // Validate bearer token here.
  const key = uuid();
  cachedKeys.set(key, true);
  return new Response(JSON.stringify({ key }));
}
