import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "quiet" };

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const styles = {
    primary: "bg-ink text-cream hover:bg-cocoa",
    outline: "border hairline bg-transparent text-ink hover:border-ink",
    quiet: "bg-white/50 text-ink hover:bg-white",
  }[variant];
  return <button className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-all duration-300 ${styles} ${className}`} {...props} />;
}
