interface CacheEntry {
    value: any;
    expiry: number;
  }
  
  const localCache = new Map<string, CacheEntry>();
  
  export const cache = {
    get: (key: string): any | null => {
      const entry = localCache.get(key);
      if (entry && entry.expiry > Date.now()) {
        return entry.value;
      }
      localCache.delete(key); // 만료된 항목 제거
      return null;
    },
  
    set: (key: string, value: any, ttl: number): void => {
      const expiry = Date.now() + ttl * 1000; // TTL은 초 단위
      localCache.set(key, { value, expiry });
    },
  
    delete: (key: string): void => {
      localCache.delete(key);
    },
  
    debug: (): void => {
      console.log('Current Cache:', Array.from(localCache.entries()));
    },
  };
  