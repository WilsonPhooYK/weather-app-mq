import { cn } from '@/lib/utils';
import { forwardRef, ReactNode } from 'react';

export type FieldWrapper = {
  name: string;
  label: string;
  tooltip?: string;
  useExternalLabel?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
};

/**
 * A wrapper component for form fields, which includes the label, error message, and optional tooltip.
 * @component
 *
 * @param {FieldWrapper} props - The props for the FieldWrapper component.
 * @param {ReactNode} props.children - The form field element (e.g., input, textarea) inside the wrapper.
 * @returns {JSX.Element} The rendered field wrapper with the label and error message.
 */
export default forwardRef<HTMLDivElement, FieldWrapper>(function FieldWrapper(
  { name, label, useExternalLabel, error = '', className, children, ...props },
  ref
) {

  return (
    <div
      ref={ref}
      className={cn('group relative flex flex-col', className)}
      {...props}
    >
      {children}
      <label
        id={`${name}-label`}
        htmlFor={name}
        className={cn(
          'whitespace-pre-wrap',
          'color-slate-300 max-w-[90%] leading-[2.15] z-[1]',
          'transition-all duration-200 ease-out',
          'motion-reduce:transition-none',
          useExternalLabel ? cn(
            'relative text-sm',
            'font-semibold text-black dark:text-white',
          ) : cn(
            'pointer-events-none',
            'min-h-[var(--input-external-label-height)]',
            'absolute left-3 top-[0.7rem] mb-0 origin-[0_0] pt-[0rem] text-slate-500 dark:text-white/70',
            'group-focus-within:-translate-y-[0.7rem] group-focus-within:scale-[0.8] group-focus-within:text-black dark:group-focus-within:text-white/30',
            'peer-data-[input-state-active=true]:-translate-y-[0.7rem] peer-data-[input-state-active=true]:scale-[0.8]',
            'peer-data-[input-state-active=true]:text-black dark:peer-data-[input-state-active=true]:text-white/30',
          )
        )}
      >
        {label}
      </label>
      <p id={`${name}-error-helper-text`} className="order-3 text-sm text-red-800 dark:text-red-400 min-h-[var(--input-error-text-height)] pl-1 translate-y-1 first-letter:capitalize">
        {error}
      </p>
    </div>
  );
});
