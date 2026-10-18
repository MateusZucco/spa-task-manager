type LoadingProps = {
  label?: string;
  className?: string;
};

export function AppLoader({ label = "Loading", className = "" }: LoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-3 py-16 text-sm text-foreground/70 ${className}`}
    >
      <span
        className="size-8 animate-spin rounded-full border-2 border-foreground/15 border-t-primary"
        aria-hidden="true"
      />
      {label}
    </div>
  );
}
