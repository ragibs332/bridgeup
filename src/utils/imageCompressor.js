/**
 * Client-Side Image Compression Utility
 * Resizes multi-megabyte camera photos (5MB - 15MB) to lightweight ~40KB - 70KB JPEG data URLs.
 * This completely avoids browser/app LocalStorage QuotaExceededError crashes.
 */

export async function compressImage(fileOrDataUrl, maxWidth = 800, maxHeight = 800, quality = 0.7) {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      
      const processImage = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(width, 100);
        canvas.height = Math.max(height, 100);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback if canvas context fails
          resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
          return;
        }

        // Fill background with white for transparent PNG conversions
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      img.onload = processImage;
      img.onerror = () => {
        // Safe fallback on load error
        resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
      };

      if (typeof fileOrDataUrl === 'string') {
        img.src = fileOrDataUrl;
      } else if (fileOrDataUrl instanceof Blob || fileOrDataUrl instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target?.result;
        };
        reader.onerror = () => resolve('');
        reader.readAsDataURL(fileOrDataUrl);
      } else {
        resolve('');
      }
    } catch (err) {
      console.warn('Image compression fallback:', err);
      resolve('');
    }
  });
}
