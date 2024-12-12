'use client';
import { useState, memo, forwardRef, useImperativeHandle, lazy, Suspense } from 'react';
import FieldWrapper from '../(partials)/FieldWrapper';
import InputWrapper from '../(partials)/InputWrapper';
import { Adornment as AdornmentType } from '../(partials)/Adornment/Adornment';

const Adornment = lazy(() => import('../(partials)/Adornment'));

export type Input = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> &
  {
    name: string;
    label: string;
    error?: string;
    useExternalLabel?: boolean;
    adornmentOnClick?: AdornmentType['onClick'];
    adornmentType?: AdornmentType['type'];
    onChange?: (value: string | undefined, name?: string) => void;
    value?: string | undefined;
  };

export type InputHandle = {
  setValue: (value: string) => void;
};

/**
 * A controlled input component that supports adornments, external labels, and error handling.
 * It also supports a reference to programmatically control the value.
 * @component
 *
 * @param {Input} props - The props for the Input component.
 * @param {Ref} ref - The forwarded ref to handle the input value programmatically.
 * @returns {JSX.Element} The rendered Input component.
 */
export default memo(
  forwardRef(function Input(
    {
      className,
      name,
      placeholder,
      useExternalLabel,
      required = true,
      disabled,
      error,
      onChange,
      label,
      value:storeValue,
      autoComplete = 'off',
      adornmentOnClick,
      adornmentType,
      ...props
    }: Input,
    ref,
  ) {
    const [value, setValue] = useState<string | undefined>(storeValue);
    const valueToUse = onChange ? storeValue : value;
    const onChangeToUse = onChange || setValue;

    useImperativeHandle(
      ref,
      () => {
        return { setValue };
      },
      [setValue],
    );

    return (
      <FieldWrapper
        className={className}
        name={name}
        label={label}
        useExternalLabel={useExternalLabel}
        error={error}
      >
        <InputWrapper isStateActive={!!valueToUse} disabled={disabled} isError={!!error}>
          <input
            {...props}
            type="text"
            id={name}
            name={name}
            placeholder={placeholder}
            value={valueToUse || ''}
            data-value={valueToUse || ''}
            onChange={(e) => onChangeToUse(e.target.value, name)}
            autoComplete={autoComplete}
            required={required}
            disabled={disabled}
            className="input-default"
            data-input-use-external-label={useExternalLabel}
            data-input-hide-placeholder={placeholder && !useExternalLabel}
            data-input-type="text"
            aria-invalid={!!error}
            {...(error ? { 'aria-describedby': `${name}-error-helper-text` } : {})}
            aria-required={required}
            aria-disabled={disabled}
          />
          {
            adornmentOnClick && adornmentType && (
              <Suspense fallback={null}>
                <Adornment
                  type={adornmentType}
                  onClick={adornmentOnClick}
                  disabled={disabled}
                  parentId={name}
                />
              </Suspense>
            )
          }
        </InputWrapper>
      </FieldWrapper>
    );
  }),
);
