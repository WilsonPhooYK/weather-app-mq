import { cn } from "@/lib/utils";
import { memo } from "react";

type Button = {
  variant?: 'primary',
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * A customizable button component that supports different styles and variants.
 * @component
 * @example
 * // Example usage of the Button component
 * <Button variant="primary" onClick={handleClick}>Primary Button</Button>
 * 
 * @param {ButtonProps} props - The props for the Button component.
 * @returns {JSX.Element} The rendered button element.
 */
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
        'focus-visible:outline-1 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-slate-300',
        'dark:focus-visible:outline-black-secondary/50',
        'disabled:pointer-events-none disabled:opacity-50',
        'bg-white text-black shadow hover:bg-white/90',
        'min-h-9 px-4 py-2',
        '[&.btn-circle]:rounded-full [&.btn-circle]:min-h-0 [&.btn-circle]:p-2.5',
        className, {
          'bg-primary text-white hover:bg-primary/90 dark:bg-primary-dark dark:hover:bg-primary-dark/90': variant === 'primary',
        }
      )}
    />
  );
});
