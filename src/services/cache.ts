import { ExplanationRequest, StructuredExplanation } from '../types';

const CACHE_STORAGE_KEY = 'clearly_cache_v1';
const MAX_CACHE_ITEMS = 150;
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

interface CacheEntry {
  key: string;
  timestamp: number;
  data: StructuredExplanation;
}

export function generateCacheKey(request: ExplanationRequest, provider: string, model?: string): string {
  const normalizedText = request.text.trim().toLowerCase();
  const mode = request.mode;
  const lang = request.targetLanguage || 'default';
  const followUp = (request.followUpQuery || '').trim().toLowerCase();
  return `${provider}:${model || ''}:${mode}:${lang}:${followUp}:${hashString(normalizedText)}`;
}

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString(36);
}

class CacheService {
  private memoryCache = new Map<string, CacheEntry>();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get([CACHE_STORAGE_KEY], (res) => {
        if (res[CACHE_STORAGE_KEY] && Array.isArray(res[CACHE_STORAGE_KEY])) {
          for (const item of res[CACHE_STORAGE_KEY]) {
            if (Date.now() - item.timestamp < CACHE_TTL_MS) {
              this.memoryCache.set(item.key, item);
            }
          }
        }
      });
    }
  }

  private saveToStorage() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      const items = Array.from(this.memoryCache.values()).slice(-MAX_CACHE_ITEMS);
      chrome.storage.local.set({ [CACHE_STORAGE_KEY]: items });
    }
  }

  get(key: string): StructuredExplanation | null {
    const entry = this.memoryCache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
      this.memoryCache.delete(key);
      return null;
    }

    return { ...entry.data, cached: true };
  }

  set(key: string, data: StructuredExplanation): void {
    if (this.memoryCache.size >= MAX_CACHE_ITEMS) {
      // Evict oldest entry (LRU)
      const oldestKey = this.memoryCache.keys().next().value;
      if (oldestKey) this.memoryCache.delete(oldestKey);
    }

    this.memoryCache.set(key, {
      key,
      timestamp: Date.now(),
      data,
    });

    this.saveToStorage();
  }

  clear(): void {
    this.memoryCache.clear();
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.remove([CACHE_STORAGE_KEY]);
    }
  }
}

export const cacheService = new CacheService();
