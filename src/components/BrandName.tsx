// Consistent brand treatment for "עלמה?" wherever it appears in JSX copy.
// Rule: solid teal by default; gradient reserved for hero-level placements.
// The question mark is part of the brand and always stays.

interface BrandNameProps {
  variant?: "solid" | "gradient";
  className?: string;
}

export default function BrandName({ variant = "solid", className = "" }: BrandNameProps) {
  const color =
    variant === "gradient"
      ? "bg-gradient-to-l from-[#00BCD4] to-[#6B4FA0] bg-clip-text text-transparent"
      : "text-[#00BCD4]";

  return (
    <span className={`font-[family-name:var(--font-heebo)] font-black ${color} ${className}`}>
      עלמה?
    </span>
  );
}
