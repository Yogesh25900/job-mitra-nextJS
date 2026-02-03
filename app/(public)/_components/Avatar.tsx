import React from "react";
import { generateAvatar, createAvatarSVG } from "../utils/avatarGenerator";

interface AvatarProps {
  googleProfilePic?: string;
  profilePic?: string;
  firstName?: string;
  lastName?: string;
  className?: string;
}

/**
 * Avatar component - displays profile picture or generates avatar with initials
 */
const Avatar: React.FC<AvatarProps> = ({
  googleProfilePic,
  profilePic,
  firstName = "",
  lastName = "",
  className = "w-10 h-10",
}) => {
  // Determine which avatar to use
  const displayAvatar = (): string => {
    // Prefer Google picture
    if (googleProfilePic) return googleProfilePic;

    // Fallback to stored profile picture
    if (profilePic) return profilePic;

    // Generate initials avatar if none exists
    const { initials, backgroundColor } = generateAvatar(firstName, lastName);
    return createAvatarSVG(initials, backgroundColor);
  };

  return (
    <img
      src={displayAvatar()}
      alt={`${firstName} ${lastName}`.trim() || "Profile"}
      className={`rounded-full border-2 border-[#9B7BFF] object-cover ${className}`}
    />
  );
};

export default Avatar;
