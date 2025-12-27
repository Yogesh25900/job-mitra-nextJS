/**
 * Generate avatar initials and background color from user's name
 */
export function generateAvatar(firstName: string = "", lastName: string = "") {
  // Get initials
  const firstInitial = firstName.charAt(0).toUpperCase() || "U"
  const lastInitial = lastName.charAt(0).toUpperCase() || ""
  const initials = firstInitial + lastInitial

  // Generate consistent color based on initials
  const colors = [
    "#FF6B6B", // Red
    "#4ECDC4", // Teal
    "#45B7D1", // Blue
    "#FFA07A", // Orange
    "#98D8C8", // Mint
    "#F7DC6F", // Yellow
    "#BB8FCE", // Purple
    "#85C1E2", // Sky Blue
  ]

  const charCode = (firstName + lastName).split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const backgroundColor = colors[charCode % colors.length]

  return { initials, backgroundColor }
}

/**
 * Create SVG data URL for avatar with initials
 */
export function createAvatarSVG(initials: string, backgroundColor: string) {
  const svg = `
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="${backgroundColor}"/>
      <text x="50" y="50" font-family="Arial, sans-serif" font-size="40" font-weight="bold" 
            fill="white" text-anchor="middle" dominant-baseline="central">
        ${initials}
      </text>
    </svg>
  `
  return `data:image/svg+xml;base64,${btoa(svg)}`
}
