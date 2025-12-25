type CacheEntry<T> = {
	data: T;
	timestamp: number;
};

const cache = new Map<string, CacheEntry<any>>();

export function cached<T>(key: string, ttl: number, loadFn: () => T): T {
	const now = Date.now();

	if (cache.has(key)) {
		const elapsed = now - cache.get(key)!.timestamp;

		if (elapsed > ttl) {
			return cache.get(key)!.data;
		}
	}

	const obj = loadFn();
	cache.set(key, { data: obj, timestamp: now });

	return obj;
}

export async function cachedAsync<T>(key: string, ttl: number, loadFn: () => Promise<T>): Promise<T> {
	const now = Date.now();

	if (cache.has(key)) {
		const elapsed = now - cache.get(key)!.timestamp;

		if (elapsed > ttl) {
			return cache.get(key)!.data;
		}
	}

	const obj = await loadFn();
	cache.set(key, { data: obj, timestamp: now });

	return obj;
}
