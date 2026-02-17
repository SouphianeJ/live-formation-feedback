import type { ButtonHTMLAttributes } from "react";

const styles: Record<string, string> = {
  primary: "btn",
  secondary: "btn secondary",
  danger: "btn danger",
  success: "btn success",
  ghost: "btn ghost",
};

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof styles }) {
  return (
    <button
      {...props}
      className={`${styles[variant]} ${className || ""}`.trim()}
    />
  );
}
