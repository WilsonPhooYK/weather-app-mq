import { cn } from '@/lib/utils';
import { ReactNode, RefObject, memo } from 'react';

type InputWrapper = {
  refObj?: RefObject<HTMLDivElement>;
  children: ReactNode;
  isStateActive: boolean;
  isError?: boolean;
  className?: string;
  disabled?: boolean;
};

/**
 * A wrapper component for form input elements, providing styling for active and error states.
 * It also supports custom classes and an optional reference for the wrapper div.
 * @component
 *
 * @param {InputWrapper} props - The props for the InputWrapper component.
 * @returns {JSX.Element} The rendered input wrapper with appropriate styling.
 */
export default memo(function InputWrapper({
  refObj,
  children,
  isStateActive,
  isError = false,
  disabled,
  className = '',
}: InputWrapper) {
  return (
    <div
      ref={refObj}
      className={cn(
        'peer relative order-2 min-h-[var(--input-height)] w-full overflow-hidden rounded-2xl border',
        'focus-within:outline focus-within:outline-1 focus-within:outline-offset-2',
        'data-[input-state-error=true]:border-red-800 data-[input-state-error=true]:outline-red-800',
        'dark:data-[input-state-error=true]:border-red-400 dark:data-[input-state-error=true]:outline-red-400',
        'motion-reduce:transition-none',
        'flex items-center',
        'bg-white/50 dark:bg-black-secondary/50 border-transparent',
        'outline-slate-300 dark:outline-black-secondary/50',
        '', {
          'bg-slate-400 text-white': disabled,
          'dark:bg-black-secondary/50  dark:outline-black-secondary/50': disabled,
        },
        className
      )}
      data-input-state-active={isStateActive}
      data-input-state-error={isError}
    >
      {children}
    </div>
  );
});
