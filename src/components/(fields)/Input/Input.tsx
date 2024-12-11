'use client';
import { useState, memo, forwardRef, useImperativeHandle } from 'react';
import FieldWrapper from '../(partials)/FieldWrapper';
import InputWrapper from '../(partials)/InputWrapper';

export type Input = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> &
  {
    name: string;
    label: string;
    error?: string;
    useExternalLabel?: boolean;
    onChange?: (value: string | undefined, name?: string) => void;
    value?: string | undefined;
  };

export type InputHandle = {
  setValue: (value: string) => void;
};

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
        </InputWrapper>
      </FieldWrapper>
    );
  }),
);
