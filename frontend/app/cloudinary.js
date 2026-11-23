export function optimizeCloudinaryUrl(url, width = 500) {
  if (!url || typeof url !== 'string') return url || '';
  if (!url.includes('res.cloudinary.com')) return url;
  if (url.includes('/image/upload/c_') || url.includes('/image/upload/f_auto') || url.includes('/image/upload/w_')) {
    return url;
  }
  return url.replace('/image/upload/', `/image/upload/c_limit,w_${width},q_auto:good,f_auto/`);
}

