/**
 * Build full image URL from backend filename
 * Backend returns filenames like "image.jpg"
 * Detects if it's a logo or profile picture based on the path or imageType parameter
 */
export const buildImageUrl = (imagePath: string | undefined, imageType?: 'logo' | 'profile'): string => {
  if (!imagePath || imagePath.trim() === '') {
    return '';
  }

  const baseURL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050').replace(/\/$/, '');

  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Clean up the imagePath - remove leading slashes if any
  const cleanImagePath = imagePath.replace(/^\/+/, '');

  // Determine the path folder
  let publicPath = '/profile_pictures/';
  
  // Check if imageType is explicitly specified
  if (imageType === 'logo') {
    publicPath = '/logos/';
  } else if (imageType === 'profile') {
    publicPath = '/profile_pictures/';
  } else {
    // Auto-detect based on the path
    if (cleanImagePath.includes('logos/')) {
      publicPath = '';  // Path already includes the folder
    } else if (cleanImagePath.includes('profile_pictures/')) {
      publicPath = '';  // Path already includes the folder
    }
  }

  // If path already includes folders, return with baseURL only
  if (cleanImagePath.includes('/')) {
    return `${baseURL}/${cleanImagePath}`;
  }

  // If it's just a filename, prepend the base URL and path
  return `${baseURL}${publicPath}${cleanImagePath}`;
};

/**
 * Get avatar URL for user
 * Tries profile picture first, then falls back to avatar, then to DiceBear
 * imageType can be 'logo' or 'profile' to specify which path to use
 */
export const getUserAvatarUrl = (
  profilePicture: string | undefined,
  avatar: string | undefined,
  email: string,
  imageType?: 'logo' | 'profile'
): string => {
  if (profilePicture) {
    return buildImageUrl(profilePicture, imageType);
  }
  if (avatar) {
    return buildImageUrl(avatar, imageType);
  }
  // Fallback to DiceBear avatar service
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`;
};
