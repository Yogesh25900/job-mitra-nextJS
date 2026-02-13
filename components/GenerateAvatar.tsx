"use client"

import { createAvatarSVG, generateAvatar } from "@/app/(public)/utils/avatarGenerator"
import Image from "next/image"

type AvatarProps = {
  profilePic?: string
  googleProfilePic?: string
  logoPath?: string
  firstName?: string
  lastName?: string
  className?: string
  isEmployer?: boolean
}

export default function GenerateAvatar({
  profilePic,
  googleProfilePic,
  logoPath,
  firstName = "",
  lastName = "",
  className = "w-10 h-10",
  isEmployer = false,
}: AvatarProps) {
  // For employers: priority is logoPath → googleProfilePic → generated avatar
  // For candidates: priority is profilePic → googleProfilePic → logoPath → generated avatar
  const imageSrc = isEmployer
    ? logoPath ||
      googleProfilePic ||
      createAvatarSVG(
        generateAvatar(firstName, lastName).initials,
        generateAvatar(firstName, lastName).backgroundColor
      )
    : profilePic ||
      googleProfilePic ||
      logoPath ||
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
