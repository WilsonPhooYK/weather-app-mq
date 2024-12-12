import { memo } from 'react';
import Button from '@/components/Button';

import imgCross from '@/assets/cross.svg';
import { cn } from '@/lib/utils';

export type Adornment = {
  onClick?: () => void;
  disabled?: boolean;
  type?: 'cancel';
  parentId: string;
};

const adornmentType: Record<NonNullable<Adornment['type']>, { src: string; label: string }> = {
  cancel: {
    src: imgCross,
    label: 'Cancel',
  },
};

/**
 * Renders an adornment button (e.g., a cancel button) that can trigger actions like closing a modal or removing an item.
 * 
 * @component
 * @example
 * <Adornment onClick={() => handleClose()} type="cancel" parentId="parentElement" />
 * 
 * @param {Adornment} props - The props for the Adornment component.
 * @returns {JSX.Element | null} The rendered button component, or null if not enough data is provided.
 */
export default memo(function Adornment({
  onClick,
  disabled = false,
  type,
  parentId,
}: Adornment) {
  if (!onClick || !type) {
    return null;
  }

  const adornment = adornmentType[type];

  return (
    <Button
      type="button"
      tabIndex={-1}
      disabled={disabled}
      title={adornment.label}
      aria-label={adornment.label}
      className={cn(
        'btn-circle shrink-0 h-[2.5rem] min-h-[2.5rem] w-[2.5rem] mr-2 bg-white/80 dark:bg-white/20 dark:hover:bg-white/30 relative z-10',
        'absolute right-0',
      )}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick?.();
        document.getElementById(parentId)?.focus();
      }}
    >
      <img src={adornment.src} alt={adornment.label} referrerPolicy="no-referrer" className="w-4 h-4 invert opacity-40" />
    </Button>
  );
});
