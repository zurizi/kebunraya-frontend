import { useRuntimeConfig } from '#app';

export function useImageUtils() {
  const runtimeConfig = useRuntimeConfig();
  const baseImgUrl = runtimeConfig.public.imgURL || runtimeConfig.public.imageCDN || '';

  const parseImageString = (imageString: string | null | undefined): string[] => {
    if (!imageString) {
      return [];
    }
    // Handles both comma-separated strings and single image strings
    return imageString.split(',')
      .map(path => path.trim())
      .filter(path => path)
      .map(path => {
        if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:')) {
          return path;
        }
        // Ensure no double slashes if baseImgUrl ends with / and path starts with /
        let fullPath = `${baseImgUrl}/${path}`;
        if (baseImgUrl.endsWith('/') && path.startsWith('/')) {
          fullPath = `${baseImgUrl}${path.substring(1)}`;
        } else if (!baseImgUrl.endsWith('/') && !path.startsWith('/')) {
           // This case should be fine as is, but good to be aware
        } else if (baseImgUrl.endsWith('/') && !path.startsWith('/')) {
           // This case is fine
        } else if (!baseImgUrl.endsWith('/') && path.startsWith('/')) {
           // This case is fine
        }

        // Normalize multiple slashes (e.g. http://domain//path -> http://domain/path)
        return fullPath.replace(/([^:]\/)\/+/g, "$1");
      });
  };

  const getFirstImage = (imageString: string | null | undefined): string | null => {
    const images = parseImageString(imageString);
    return images.length > 0 ? images[0] : null;
  };

  return {
    parseImageString,
    getFirstImage,
    baseImgUrl
  };
}
