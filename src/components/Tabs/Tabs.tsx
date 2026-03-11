import * as React from 'react';
import { cx } from '../../internal/cx';
import { useControllableState } from '../../hooks/useControllableState';
import styles from './Tabs.module.css';

export type TabsOrientation = 'horizontal' | 'vertical';
export type TabsActivationMode = 'automatic' | 'manual';

type ControlledTabsProps = {
  value: string;
  onValueChange: (value: string) => void;
  defaultValue?: never;
};

type UncontrolledTabsProps = {
  defaultValue: string;
  value?: never;
  onValueChange?: (value: string) => void;
};

export type TabsRootProps = React.HTMLAttributes<HTMLDivElement> & {
  activationMode?: TabsActivationMode;
  orientation?: TabsOrientation;
} & (ControlledTabsProps | UncontrolledTabsProps);

type TabsContextValue = {
  activationMode: TabsActivationMode;
  baseId: string;
  orientation: TabsOrientation;
  value: string;
  setValue: (value: string) => void;
  registerTrigger: (value: string, ref: React.RefObject<HTMLButtonElement | null>, disabled: boolean) => () => void;
  moveFocus: (currentValue: string, direction: 'next' | 'previous' | 'first' | 'last') => void;
};

type TriggerRegistration = {
  ref: React.RefObject<HTMLButtonElement | null>;
  disabled: boolean;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext(componentName: string) {
  const context = React.useContext(TabsContext);

  if (!context) {
    throw new Error(`${componentName} must be used within Tabs.`);
  }

  return context;
}

function sanitizeValue(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export function Tabs(props: TabsRootProps) {
  const {
    children,
    className,
    activationMode = 'automatic',
    orientation = 'horizontal',
    onValueChange,
    ...restProps
  } = props;
  const defaultValue = 'defaultValue' in props ? props.defaultValue : props.value;
  const controlledValue = 'value' in props ? props.value : undefined;
  const rootProps = { ...restProps } as Record<string, unknown>;
  delete rootProps.value;
  delete rootProps.defaultValue;

  const [value, setValue] = useControllableState({
    value: controlledValue,
    defaultValue,
    onChange: onValueChange
  });
  const baseId = React.useId();
  const triggerMap = React.useRef(new Map<string, TriggerRegistration>());

  const registerTrigger = React.useCallback(
    (triggerValue: string, ref: React.RefObject<HTMLButtonElement | null>, disabled: boolean) => {
      triggerMap.current.set(triggerValue, { ref, disabled });

      return () => {
        triggerMap.current.delete(triggerValue);
      };
    },
    []
  );

  const moveFocus = React.useCallback(
    (currentValue: string, direction: 'next' | 'previous' | 'first' | 'last') => {
      const triggerEntries = Array.from(triggerMap.current.entries()).filter(([, trigger]) => !trigger.disabled);

      if (triggerEntries.length === 0) {
        return;
      }

      const currentIndex = triggerEntries.findIndex(([entryValue]) => entryValue === currentValue);
      let nextIndex = currentIndex;

      if (direction === 'first') {
        nextIndex = 0;
      } else if (direction === 'last') {
        nextIndex = triggerEntries.length - 1;
      } else if (direction === 'next') {
        nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % triggerEntries.length;
      } else {
        nextIndex = currentIndex <= 0 ? triggerEntries.length - 1 : currentIndex - 1;
      }

      const nextEntry = triggerEntries[nextIndex];
      if (!nextEntry) {
        return;
      }

      const [nextValue, nextTrigger] = nextEntry;
      nextTrigger.ref.current?.focus();

      if (activationMode === 'automatic') {
        setValue(nextValue);
      }
    },
    [activationMode, setValue]
  );

  const contextValue = React.useMemo<TabsContextValue>(
    () => ({
      activationMode,
      baseId,
      orientation,
      value,
      setValue,
      registerTrigger,
      moveFocus
    }),
    [activationMode, baseId, moveFocus, orientation, registerTrigger, setValue, value]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cx(className, styles.root)} {...(rootProps as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export type TabsListProps = React.HTMLAttributes<HTMLDivElement>;

function TabsList({ className, ...props }: TabsListProps) {
  const { orientation } = useTabsContext('Tabs.List');

  return (
    <div
      aria-orientation={orientation}
      className={cx(className, styles.list)}
      data-orientation={orientation}
      role="tablist"
      {...props}
    />
  );
}

export type TabsTriggerProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> & {
  value: string;
};

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(function TabsTrigger(
  { className, disabled = false, onClick, onKeyDown, value, ...props },
  forwardedRef
) {
  const {
    activationMode,
    baseId,
    moveFocus,
    orientation,
    registerTrigger,
    setValue,
    value: selectedValue
  } = useTabsContext('Tabs.Trigger');
  const internalRef = React.useRef<HTMLButtonElement>(null);
  const selected = selectedValue === value;

  React.useEffect(() => registerTrigger(value, internalRef, disabled), [registerTrigger, disabled, value]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    onKeyDown?.(event);

    if (event.defaultPrevented) {
      return;
    }

    const previousKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
    const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';

    if (event.key === nextKey) {
      event.preventDefault();
      moveFocus(value, 'next');
    } else if (event.key === previousKey) {
      event.preventDefault();
      moveFocus(value, 'previous');
    } else if (event.key === 'Home') {
      event.preventDefault();
      moveFocus(value, 'first');
    } else if (event.key === 'End') {
      event.preventDefault();
      moveFocus(value, 'last');
    } else if (activationMode === 'manual' && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      setValue(value);
    }
  }

  return (
    <button
      ref={(node) => {
        internalRef.current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      }}
      aria-controls={`${baseId}-${sanitizeValue(value)}-panel`}
      aria-selected={selected}
      className={cx(className, styles.trigger)}
      data-state={selected ? 'active' : 'inactive'}
      disabled={disabled}
      id={`${baseId}-${sanitizeValue(value)}-trigger`}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          setValue(value);
        }
      }}
      onKeyDown={handleKeyDown}
      role="tab"
      tabIndex={selected ? 0 : -1}
      type="button"
      {...props}
    />
  );
});

export type TabsPanelProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string;
};

function TabsPanel({ className, value, ...props }: TabsPanelProps) {
  const { baseId, value: selectedValue } = useTabsContext('Tabs.Panel');
  const selected = selectedValue === value;
  const sanitizedValue = sanitizeValue(value);

  return (
    <div
      aria-labelledby={`${baseId}-${sanitizedValue}-trigger`}
      className={cx(className, styles.panel)}
      hidden={!selected}
      id={`${baseId}-${sanitizedValue}-panel`}
      role="tabpanel"
      tabIndex={0}
      {...props}
    />
  );
}

export const TabsRoot = Object.assign(Tabs, {
  List: TabsList,
  Trigger: TabsTrigger,
  Panel: TabsPanel
});