import type { ButtonHTMLAttributes } from "react";

const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-reference";

export function PrimaryButton({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`flex h-12 w-full items-center justify-center rounded-[12px] bg-target px-6 text-[13px] font-semibold tracking-[0.16em] text-background transition-colors duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 ${focus} ${className}`}
      {...props}
    />
  );
}

export function StepButton({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`inline-flex h-11 min-w-11 items-center justify-center rounded-[10px] border border-border bg-surface-2 px-3 text-lg leading-none text-text-primary transition-colors duration-150 hover:border-text-muted disabled:cursor-not-allowed disabled:opacity-40 ${focus} ${className}`}
      {...props}
    />
  );
}
