import * as React from 'react';
import { cx } from '../../internal/cx';
import styles from './Field.module.css';

type FieldOrientation = 'vertical' | 'horizontal';

type FieldContextValue = {
  controlId: string;
  descriptionId: string;
  errorId: string;
  invalid: boolean;
  disabled: boolean;
  required: boolean;
  registerDescription: () => () => void;
  registerError: () => () => void;
  hasDescription: boolean;
  hasError: boolean;
};

const FieldContext = React.createContext<FieldContextValue | null>(null);

function useFieldContext() {
  return React.useContext(FieldContext);
}

function usePresenceCounter() {
  const [count, setCount] = React.useState(0);

  const register = React.useCallback(() => {
    setCount((currentCount) => currentCount + 1);

    return () => {
      setCount((currentCount) => currentCount - 1);
    };
  }, []);

  return [count > 0, register] as const;
}

export type FieldProps = React.HTMLAttributes<HTMLDivElement> & {
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  orientation?: FieldOrientation;
};

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(function Field(
  {
    children,
    className,
    invalid = false,
    disabled = false,
    required = false,
    orientation = 'vertical',
    ...props
  },
  forwardedRef
) {
  const id = React.useId();
  const [hasDescription, registerDescription] = usePresenceCounter();
  const [hasError, registerError] = usePresenceCounter();

  const contextValue = React.useMemo<FieldContextValue>(
    () => ({
      controlId: `${id}-control`,
      descriptionId: `${id}-description`,
      errorId: `${id}-error`,
      invalid,
      disabled,
      required,
      registerDescription,
      registerError,
      hasDescription,
      hasError
    }),
    [disabled, hasDescription, hasError, id, invalid, registerDescription, registerError, required]
  );

  return (
    <FieldContext.Provider value={contextValue}>
      <div
        ref={forwardedRef}
        className={cx(className, styles.root, styles[orientation])}
        data-disabled={disabled ? '' : undefined}
        data-invalid={invalid ? '' : undefined}
        {...props}
      >
        {children}
      </div>
    </FieldContext.Provider>
  );
});

export type FieldLabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(function FieldLabel(
  { children, className, htmlFor, ...props },
  forwardedRef
) {
  const context = useFieldContext();

  return (
    <label
      ref={forwardedRef}
      className={cx(className, styles.label)}
      htmlFor={htmlFor ?? context?.controlId}
      {...props}
    >
      {children}
    </label>
  );
});

export type FieldDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export const FieldDescription = React.forwardRef<HTMLParagraphElement, FieldDescriptionProps>(
  function FieldDescription({ children, className, id, ...props }, forwardedRef) {
    const context = useFieldContext();

    React.useEffect(() => context?.registerDescription(), [context]);

    return (
      <p
        ref={forwardedRef}
        className={cx(className, styles.description)}
        id={id ?? context?.descriptionId}
        {...props}
      >
        {children}
      </p>
    );
  }
);

export type FieldErrorProps = React.HTMLAttributes<HTMLParagraphElement>;

export const FieldError = React.forwardRef<HTMLParagraphElement, FieldErrorProps>(function FieldError(
  { children, className, id, role, ...props },
  forwardedRef
) {
  const context = useFieldContext();

  React.useEffect(() => context?.registerError(), [context]);

  return (
    <p
      ref={forwardedRef}
      className={cx(className, styles.error)}
      id={id ?? context?.errorId}
      role={role ?? (context?.invalid ? 'alert' : undefined)}
      {...props}
    >
      {children}
    </p>
  );
});

type FieldControlProps = {
  id?: string | undefined;
  disabled?: boolean | undefined;
  required?: boolean | undefined;
  invalid?: boolean | undefined;
  'aria-describedby'?: string | undefined;
  'aria-invalid'?: React.AriaAttributes['aria-invalid'];
  'aria-errormessage'?: string | undefined;
};

export function useFieldControlProps<Props extends FieldControlProps>(props: Props): Props {
  const context = useFieldContext();

  if (!context) {
    return props;
  }

  const invalid = props.invalid ?? context.invalid;
  const describedBy = [
    props['aria-describedby'],
    context.hasDescription ? context.descriptionId : undefined,
    invalid && context.hasError ? context.errorId : undefined
  ]
    .filter(Boolean)
    .join(' ');

  return {
    ...props,
    id: props.id ?? context.controlId,
    disabled: props.disabled ?? context.disabled,
    required: props.required ?? context.required,
    invalid,
    'aria-describedby': describedBy || undefined,
    'aria-invalid': props['aria-invalid'] ?? (invalid ? true : undefined),
    'aria-errormessage': props['aria-errormessage'] ?? (invalid && context.hasError ? context.errorId : undefined)
  };
}