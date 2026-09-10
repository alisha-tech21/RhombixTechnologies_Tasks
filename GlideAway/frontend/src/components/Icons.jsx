// Minimal, consistent-stroke line icons used across the app instead of emoji.
// currentColor means each icon inherits whatever text color it's placed in.

export function IconCompass(props) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M14.8 9.2l-2.1 5.7-5.7 2.1 2.1-5.7z" />
    </svg>
  );
}

export function IconMail(props) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      {...props}
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

export function IconLock(props) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      {...props}
    >
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export function IconUser(props) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      {...props}
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.6-3.6 5-5.5 7.5-5.5s5.9 1.9 7.5 5.5" />
    </svg>
  );
}

export function IconPhone(props) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      {...props}
    >
      <path d="M6.5 3h3l1.5 4.5-2 1.5a12 12 0 0 0 6 6l1.5-2 4.5 1.5v3a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 4.5 5.2 2 2 0 0 1 6.5 3z" />
    </svg>
  );
}

export function IconChevronLeft(props) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconChevronRight(props) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconArrowRight(props) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Simplified single-color brand monograms (not literal logos) for social buttons.
export function IconGoogle(props) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h8M12 8v8" strokeLinecap="round" />
    </svg>
  );
}
export function IconFacebook(props) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <path d="M14 21v-7h2.5l.5-3H14V9c0-.9.3-1.5 1.7-1.5H17V4.8C16.6 4.7 15.6 4.6 14.5 4.6 12.1 4.6 10.5 6 10.5 8.7V11H8v3h2.5v7z" />
    </svg>
  );
}
export function IconTwitter(props) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <path d="M20 7.5c-.6.3-1.3.5-2 .6.7-.4 1.3-1.2 1.5-2-.7.4-1.5.7-2.3.9A3.6 3.6 0 0 0 11 10c0 .3 0 .5.1.8-3-.2-5.6-1.6-7.4-3.8-.3.6-.5 1.2-.5 1.9 0 1.3.6 2.4 1.6 3.1-.6 0-1.1-.2-1.6-.4v.1c0 1.8 1.3 3.3 3 3.7-.3.1-.6.1-1 .1-.2 0-.5 0-.7-.1.5 1.5 1.9 2.6 3.6 2.6A7.3 7.3 0 0 1 3 19.5 10.3 10.3 0 0 0 8.6 21c6.7 0 10.4-5.6 10.4-10.4v-.5c.7-.5 1.3-1.1 1.8-1.9z" />
    </svg>
  );
}
