import React from 'react';
import { Image } from 'primereact/image';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useImageCache } from '../lib/useImageCache';

interface CachedImageProps {
  src: string;
  alt: string;
  width?: string;
  height?: string;
  className?: string;
  preview?: boolean;
}

const CachedImage: React.FC<CachedImageProps> = ({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  preview = false 
}) => {
  const { cachedUrl, isLoading } = useImageCache(src);

  if (isLoading) {
    return (
      <div 
        className={`flex align-items-center justify-content-center ${className}`}
        style={{ width, height, minHeight: height || '50px' }}
      >
        <ProgressSpinner style={{ width: '2rem', height: '2rem' }} />
      </div>
    );
  }

  return (
    <Image
      src={cachedUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      preview={preview}
    />
  );
};

export default CachedImage;