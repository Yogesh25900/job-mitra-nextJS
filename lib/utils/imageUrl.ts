/**
 * Build full image URL from backend filename
 * Backend returns filenames like "image.jpg"
 * We need to prepend the full path like "http://localhost:5050/public/profile_pictures/image.jpg"
 */
export const buildImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath || imagePath.trim() === '') {
    return '';
  }

  const baseURL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050').replace(/\/$/, '');
  const publicPath = '/profile_pictures/';

  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Clean up the imagePath - remove leading slashes if any
  const cleanImagePath = imagePath.replace(/^\/+/, '');

  // If it's just a filename, prepend the base URL and path
  return `${baseURL}${publicPath}${cleanImagePath}`;
};

/**
 * Get avatar URL for user
 * Tries profile picture first, then falls back to avatar, then to DiceBear
 */
export const getUserAvatarUrl = (
  profilePicture: string | undefined,
  avatar: string | undefined,
  email: string
): string => {
  if (profilePicture) {
    return buildImageUrl(profilePicture);
  }
  if (avatar) {
    return buildImageUrl(avatar);
  }
  // Fallback to DiceBear avatar service
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`;
};
