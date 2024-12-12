"use client";
import { cn } from "@/lib/utils";
import { useState, memo, forwardRef, useImperativeHandle } from "react";

export type Input = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "type" | "value"
> & {
  name: string;
  label: string;
  onChange?: (value: boolean | undefined, name?: string) => void;
  value?: boolean | undefined;
};

export type SwitchHandle = {
  setValue: (value: string) => void;
};

export default memo(
  forwardRef(function Switch(
    {
      name,
      disabled,
      onChange,
      label,
      value: storeValue,
      ...props
    }: Input,
    ref
  ) {
    const [value, setValue] = useState<boolean | undefined>(storeValue);
    const valueToUse = onChange ? storeValue : value;
    const onChangeToUse = onChange || setValue;

    useImperativeHandle(
      ref,
      () => {
        return { setValue };
      },
      [setValue]
    );

    return (
      <label className="inline-flex items-center cursor-pointer">
        <input
          {...props}
          name={name}
          type="checkbox"
          checked={valueToUse}
          className="sr-only peer"
          onChange={() => onChangeToUse(!valueToUse)}
          disabled={disabled}
        />
        <div className={cn(
          'relative w-11 h-6 bg-white/50 peer-focus:outline peer-focus:outline-1 peer-focus:outline-offset-2 peer-focus:outline-slate-300 dark:peer-focus:outline-black-secondary/50',
          'rounded-full peer dark:bg-black-secondary/50 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full',
          'peer-checked:after:border-white dark:border-gray-600 peer-checked:bg-primary dark:peer-checked:bg-primary-dark',
          'after:content-[""] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all',
        )}></div>
        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          {label}
        </span>
      </label>
    );
  })
);
