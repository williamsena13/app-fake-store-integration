import { useState, useEffect } from 'react';
import { imageCache } from './imageCache';

export const useImageCache = (url: string) => {
  const [cachedUrl, setCachedUrl] = useState<string>(url);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!url) return;

    setIsLoading(true);
    imageCache.getImage(url)
      .then(setCachedUrl)
      .finally(() => setIsLoading(false));
  }, [url]);

  return { cachedUrl, isLoading };
};