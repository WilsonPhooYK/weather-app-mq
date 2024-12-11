import { cn } from "@/lib/utils";
import { memo } from "react";

type Button = {
  variant?: 'primary',
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default memo(function Button({
  className,
  variant,

  ...props
}: Button) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
        'bg-white text-black shadow hover:bg-white/90',
        'min-h-9 px-4 py-2',
        '[&.btn-circle]:rounded-full [&.btn-circle]:min-h-0 [&.btn-circle]:p-2.5',
        className, {
          'bg-purple-900 text-white hover:bg-purple-900/90': variant === 'primary',
        }
      )}
    />
  );
});
