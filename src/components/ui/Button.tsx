import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "whatsapp" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-heading  transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-dark hover:-translate-y-0.5 shadow-sm hover:shadow-md",
  secondary:
    "border border-ink/15 text-ink bg-white hover:border-ink/40 hover:-translate-y-0.5",
  whatsapp:
    "bg-whatsapp text-white hover:bg-whatsapp-dark hover:-translate-y-0.5 shadow-sm hover:shadow-md",
  ghost: "text-accent hover:bg-accent-soft",
};

const sizes = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

interface ButtonProps {
  variant?: Variant;
  size?: keyof typeof sizes;
  href?: string;
  external?: boolean;
  children: ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  external,
  children,
  className = "",
  ...rest
}: ButtonProps & Omit<ComponentProps<"button">, "className">) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
