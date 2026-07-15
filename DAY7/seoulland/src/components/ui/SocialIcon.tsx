type Props = {
  name: "facebook" | "instagram" | "youtube";
  size?: number;
};

export default function SocialIcon({ name, size = 18 }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (name === "facebook") {
    return (
      <svg {...common} fill="currentColor" stroke="none">
        <path d="M13.5 21v-7.5h2.5l.4-3H13.5V8.4c0-.87.24-1.46 1.5-1.46h1.6V4.35C16.3 4.24 15.4 4.15 14.35 4.15c-2.24 0-3.77 1.37-3.77 3.88v2.47H8v3h2.58V21z" />
      </svg>
    );
  }

  if (name === "instagram") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg {...common} fill="currentColor" stroke="none">
      <rect x="2.5" y="6" width="19" height="12" rx="3" fill="none" stroke="currentColor" strokeWidth={1.8} />
      <path d="M10.5 9.5v5l4.3-2.5z" />
    </svg>
  );
}
