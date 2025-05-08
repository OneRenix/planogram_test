import { useState, useEffect } from 'react';

const useImage = (url: string): HTMLImageElement | null => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;
    
    img.onload = () => {
      setImage(img);
    };
    
    return () => {
      img.onload = null;
    };
  }, [url]);

  return image;
};

export default useImage;