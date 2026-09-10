export function getAvatarUrl(profilePicture, name = "User") {
  if (profilePicture) {
    return `${import.meta.env.VITE_SOCKET_URL}${profilePicture}`;
  }
  // Auto-generates a clean initials avatar — no local file needed
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=fff&bold=true`;
}
