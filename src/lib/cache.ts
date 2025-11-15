// Cache utility for storing API responses in localStorage
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // in milliseconds
}

class Cache {
  private prefix = 'stonks_cache_';

  set<T>(key: string, data: T, expiresIn: number = 5 * 60 * 1000): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresIn,
    };
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(entry));
    } catch (error) {
      console.warn('Failed to cache data:', error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return null;

      const entry: CacheEntry<T> = JSON.parse(item);
      const now = Date.now();

      // Check if cache has expired
      if (now - entry.timestamp > entry.expiresIn) {
        this.delete(key);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.warn('Failed to read cache:', error);
      return null;
    }
  }

  delete(key: string): void {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.warn('Failed to delete cache:', error);
    }
  }

  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }
}

export const cache = new Cache();
