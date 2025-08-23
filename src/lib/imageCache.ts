class ImageCache {
  private cache = new Map<string, string>();
  private readonly CACHE_KEY = 'image_cache';
  private readonly MAX_CACHE_SIZE = 100;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.CACHE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.cache = new Map(data);
      }
    } catch (error) {
      console.warn('Failed to load image cache:', error);
    }
  }

  private saveToStorage() {
    try {
      const data = Array.from(this.cache.entries());
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save image cache:', error);
    }
  }

  async getImage(url: string): Promise<string> {
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const dataUrl = await this.blobToDataUrl(blob);
      
      this.setImage(url, dataUrl);
      return dataUrl;
    } catch (error) {
      console.warn('Failed to cache image:', url, error);
      return url;
    }
  }

  private blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }

  private setImage(url: string, dataUrl: string) {
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    
    this.cache.set(url, dataUrl);
    this.saveToStorage();
  }

  clearCache() {
    this.cache.clear();
    localStorage.removeItem(this.CACHE_KEY);
  }
}

export const imageCache = new ImageCache();