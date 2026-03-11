import * as React from 'react';

type UseControllableStateParams<T> = {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
};

export function useControllableState<T>({
  value,
  defaultValue,
  onChange
}: UseControllableStateParams<T>) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : uncontrolledValue;

  const setValue = React.useCallback(
    (nextValue: React.SetStateAction<T>) => {
      const resolvedValue = typeof nextValue === 'function'
        ? (nextValue as (previousValue: T) => T)(currentValue)
        : nextValue;

      if (!isControlled) {
        setUncontrolledValue(resolvedValue);
      }

      if (!Object.is(currentValue, resolvedValue)) {
        onChange?.(resolvedValue);
      }
    },
    [currentValue, isControlled, onChange]
  );

  return [currentValue, setValue] as const;
}