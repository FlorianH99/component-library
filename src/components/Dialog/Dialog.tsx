import * as React from 'react';
import { Portal } from '../../internal/Portal';
import { cx } from '../../internal/cx';
import { getFocusableElements } from '../../internal/getFocusableElements';
import { mergeRefs } from '../../internal/mergeRefs';
import { Slot } from '../../primitives/Slot';
import { useControllableState } from '../../hooks/useControllableState';
import styles from './Dialog.module.css';

type ControlledDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultOpen?: never;
};

type UncontrolledDialogProps = {
  defaultOpen?: boolean;
  open?: never;
  onOpenChange?: (open: boolean) => void;
};

export type DialogRootProps = {
  children: React.ReactNode;
} & (ControlledDialogProps | UncontrolledDialogProps);

type DialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  titleId: string;
  descriptionId: string;
  registerTitle: () => () => void;
  registerDescription: () => () => void;
  hasTitle: boolean;
  hasDescription: boolean;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext(componentName: string) {
  const context = React.useContext(DialogContext);

  if (!context) {
    throw new Error(`${componentName} must be used within Dialog.`);
  }

  return context;
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

export function Dialog(props: DialogRootProps) {
  const defaultOpen = 'defaultOpen' in props ? props.defaultOpen ?? false : props.open;
  const controlledOpen = 'open' in props ? props.open : undefined;
  const [open, setOpen] = useControllableState({
    value: controlledOpen,
    defaultValue: defaultOpen,
    onChange: props.onOpenChange
  });
  const triggerRef = React.useRef<HTMLElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const baseId = React.useId();
  const [hasTitle, registerTitle] = usePresenceCounter();
  const [hasDescription, registerDescription] = usePresenceCounter();

  const contextValue = React.useMemo<DialogContextValue>(
    () => ({
      open,
      setOpen,
      triggerRef,
      contentRef,
      titleId: `${baseId}-title`,
      descriptionId: `${baseId}-description`,
      registerTitle,
      registerDescription,
      hasTitle,
      hasDescription
    }),
    [baseId, hasDescription, hasTitle, open, registerDescription, registerTitle, setOpen]
  );

  return <DialogContext.Provider value={contextValue}>{props.children}</DialogContext.Provider>;
}

type DialogTriggerAsChildProps = {
  asChild: true;
  children: React.ReactElement;
};

type DialogTriggerButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: false;
};

export type DialogTriggerProps = DialogTriggerAsChildProps | DialogTriggerButtonProps;

const DialogTrigger = React.forwardRef<HTMLElement, DialogTriggerProps>(function DialogTrigger(
  props,
  forwardedRef
) {
  const context = useDialogContext('Dialog.Trigger');

  if (props.asChild) {
    return (
      <Slot
        ref={mergeRefs(forwardedRef, context.triggerRef)}
        aria-expanded={context.open}
        aria-haspopup="dialog"
        onClick={() => context.setOpen(true)}
      >
        {props.children}
      </Slot>
    );
  }

  const { children, onClick, type = 'button', ...buttonProps } = props;

  return (
    <button
      {...buttonProps}
      ref={mergeRefs(forwardedRef, context.triggerRef as React.Ref<HTMLButtonElement>)}
      aria-expanded={context.open}
      aria-haspopup="dialog"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          context.setOpen(true);
        }
      }}
      type={type}
    >
      {children}
    </button>
  );
});

type DialogCloseAsChildProps = {
  asChild: true;
  children: React.ReactElement;
};

type DialogCloseButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: false;
};

export type DialogCloseProps = DialogCloseAsChildProps | DialogCloseButtonProps;

const DialogClose = React.forwardRef<HTMLElement, DialogCloseProps>(function DialogClose(props, forwardedRef) {
  const context = useDialogContext('Dialog.Close');

  if (props.asChild) {
    return (
      <Slot ref={forwardedRef} onClick={() => context.setOpen(false)}>
        {props.children}
      </Slot>
    );
  }

  const { children, onClick, type = 'button', ...buttonProps } = props;

  return (
    <button
      {...buttonProps}
      ref={forwardedRef as React.Ref<HTMLButtonElement>}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          context.setOpen(false);
        }
      }}
      type={type}
    >
      {children}
    </button>
  );
});

const dialogSizes = ['sm', 'md', 'lg'] as const;

export type DialogSize = (typeof dialogSizes)[number];

export type DialogContentProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: DialogSize;
  closeOnOverlayPress?: boolean;
};

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent(
  { children, className, closeOnOverlayPress = true, size = 'md', ...props },
  forwardedRef
) {
  const context = useDialogContext('Dialog.Content');

  React.useEffect(() => {
    if (!context.open) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [context.open]);

  React.useEffect(() => {
    if (!context.open) {
      return;
    }

    const content = context.contentRef.current;
    const previousFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    if (!content) {
      return;
    }

    const autoFocusTarget = content.querySelector<HTMLElement>('[data-autofocus="true"]');
    const focusableElements = getFocusableElements(content);
    (autoFocusTarget ?? focusableElements[0] ?? content).focus();

    return () => {
      const fallbackTarget = context.triggerRef.current ?? previousFocusedElement;
      fallbackTarget?.focus();
    };
  }, [context.open, context.contentRef, context.triggerRef]);

  if (!context.open) {
    return null;
  }

  return (
    <Portal>
      <div
        className={styles.overlay}
        onMouseDown={(event) => {
          if (closeOnOverlayPress && event.target === event.currentTarget) {
            context.setOpen(false);
          }
        }}
      >
        <div
          {...props}
          ref={mergeRefs(forwardedRef, context.contentRef)}
          aria-describedby={context.hasDescription ? context.descriptionId : undefined}
          aria-labelledby={context.hasTitle ? context.titleId : undefined}
          aria-modal="true"
          className={cx(className, styles.content, styles[size])}
          onKeyDown={(event) => {
            props.onKeyDown?.(event);

            if (event.defaultPrevented) {
              return;
            }

            if (event.key === 'Escape') {
              event.preventDefault();
              context.setOpen(false);
              return;
            }

            if (event.key !== 'Tab') {
              return;
            }

            const currentContent = context.contentRef.current;
            if (!currentContent) {
              return;
            }

            const focusableElements = getFocusableElements(currentContent);
            if (focusableElements.length === 0) {
              event.preventDefault();
              currentContent.focus();
              return;
            }

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            const activeElement = document.activeElement;

            if (event.shiftKey && activeElement === firstElement) {
              event.preventDefault();
              lastElement.focus();
            } else if (!event.shiftKey && activeElement === lastElement) {
              event.preventDefault();
              firstElement.focus();
            }
          }}
          role="dialog"
          tabIndex={-1}
        >
          {children}
        </div>
      </div>
    </Portal>
  );
});

export type DialogTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

function DialogTitle({ className, id, ...props }: DialogTitleProps) {
  const context = useDialogContext('Dialog.Title');

  React.useEffect(() => context.registerTitle(), [context.registerTitle]);

  return <h2 className={cx(className, styles.title)} id={id ?? context.titleId} {...props} />;
}

export type DialogDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

function DialogDescription({ className, id, ...props }: DialogDescriptionProps) {
  const context = useDialogContext('Dialog.Description');

  React.useEffect(() => context.registerDescription(), [context.registerDescription]);

  return <p className={cx(className, styles.description)} id={id ?? context.descriptionId} {...props} />;
}

export const DialogRoot = Object.assign(Dialog, {
  Trigger: DialogTrigger,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose
});