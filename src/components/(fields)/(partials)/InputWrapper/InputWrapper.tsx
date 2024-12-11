import clsx from 'clsx';
import { ReactNode, RefObject, memo } from 'react';

type InputWrapper = {
  refObj?: RefObject<HTMLDivElement>;
  children: ReactNode;
  isStateActive: boolean;
  isError?: boolean;
  className?: string;
  disabled?: boolean;
};

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
      className={clsx(
        disabled ? 'bg-slate-300' : 'bg-white/50',
        'peer relative order-2 min-h-[var(--input-height)] w-full overflow-hidden rounded-2xl border border-slate-300',
        'outline-slate-300 disabled:[&_input]:!text-black',
        'focus-within:outline focus-within:outline-1 focus-within:outline-offset-2',
        'data-[input-state-error=true]:border-red-500 data-[input-state-error=true]:outline-red-500',
        'motion-reduce:transition-none',
        'flex items-center',
        className
      )}
      data-input-state-active={isStateActive}
      data-input-state-error={isError}
    >
      {children}
    </div>
  );
});
