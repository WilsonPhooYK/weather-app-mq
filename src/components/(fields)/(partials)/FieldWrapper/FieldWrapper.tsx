import clsx from 'clsx';
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

export default forwardRef<HTMLDivElement, FieldWrapper>(function FieldWrapper(
  { name, label, useExternalLabel, error = '', className, children, ...props },
  ref
) {

  return (
    <div
      ref={ref}
      className={clsx('group relative flex flex-col', className)}
      {...props}
    >
      {children}
      <label
        id={`${name}-label`}
        htmlFor={name}
        className={clsx(
          'whitespace-pre-wrap',
          'color-slate-300 max-w-[90%] leading-[2.15] z-[1]',
          'transition-all duration-200 ease-out',
          'motion-reduce:transition-none',
          useExternalLabel ? clsx(
            'relative text-sm',
            'font-semibold text-black',
          ) : clsx(
            'min-h-[var(--input-external-label-height)]',
            'absolute left-3 top-[0.7rem] mb-0 origin-[0_0] pt-[0rem] text-slate-500',
            'group-focus-within:-translate-y-[0.7rem] group-focus-within:scale-[0.8] group-focus-within:text-slate-800',
            'peer-data-[input-state-active=true]:-translate-y-[0.7rem] peer-data-[input-state-active=true]:scale-[0.8] peer-data-[input-state-active=true]:text-slate-800'
          )
        )}
      >
        {label}
      </label>
      <p id={`${name}-error-helper-text`} className="order-3 text-sm text-red-500 min-h-[var(--input-error-text-height)]">
        {error}
      </p>
    </div>
  );
});
