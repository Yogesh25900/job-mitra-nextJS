"use client"

import { createAvatarSVG, generateAvatar } from "@/app/(public)/utils/avatarGenerator"
import Image from "next/image"

type AvatarProps = {
  profilePic?: string
  googleProfilePic?: string
  firstName?: string
  lastName?: string
  className?: string
}

export default function GenerateAvatar({
  profilePic,
  googleProfilePic,
  firstName = "",
  lastName = "",
  className = "w-10 h-10",
}: AvatarProps) {
  // Priority: uploaded pic → google pic → generated avatar
  const imageSrc =
    profilePic ||
    googleProfilePic ||
    createAvatarSVG(
      generateAvatar(firstName, lastName).initials,
      generateAvatar(firstName, lastName).backgroundColor
    )

  return (
    <div
      className={`relative rounded-full overflow-hidden ${className}`}
    >
      <Image
        src={imageSrc}
        alt="User Avatar"
        fill
        sizes="40px"
        className="object-cover"
      />
    </div>
  )
}
