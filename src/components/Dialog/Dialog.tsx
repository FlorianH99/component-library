import * as React from 'react';
import { Portal } from '../../internal/Portal';
import { cx } from '../../internal/cx';
import { getFocusableElements } from '../../internal/getFocusableElements';
import { mergeRefs } from '../../internal/mergeRefs';
import { useSafeLayoutEffect } from '../../internal/useSafeLayoutEffect';
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
  const defaultOpen = 'defaultOpen' in props ? props.defaultOpen ?? false : props.open ?? false;
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
  const { open, setOpen, triggerRef } = useDialogContext('Dialog.Trigger');

  if (props.asChild) {
    return (
      <Slot
        ref={mergeRefs(forwardedRef, triggerRef)}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        {props.children}
      </Slot>
    );
  }

  const { children, onClick, type = 'button', ...buttonProps } = props;

  return (
    <button
      {...buttonProps}
      ref={mergeRefs(forwardedRef, triggerRef as React.Ref<HTMLButtonElement>)}
      aria-expanded={open}
      aria-haspopup="dialog"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          setOpen(true);
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
  const { setOpen } = useDialogContext('Dialog.Close');

  if (props.asChild) {
    return (
      <Slot ref={forwardedRef} onClick={() => setOpen(false)}>
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
          setOpen(false);
        }
      }}
      type={type}
    >
      {children}
    </button>
  );
});

export type DialogSize = 'sm' | 'md' | 'lg';

export type DialogContentProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: DialogSize;
  closeOnOverlayPress?: boolean;
};

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent(
  { children, className, closeOnOverlayPress = true, size = 'md', ...props },
  forwardedRef
) {
  const { contentRef, descriptionId, hasDescription, hasTitle, open, setOpen, titleId, triggerRef } =
    useDialogContext('Dialog.Content');

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  useSafeLayoutEffect(() => {
    if (!open) {
      return;
    }

    const content = contentRef.current;
    const previousFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const fallbackTrigger = triggerRef.current;

    if (!content) {
      return;
    }

    const autoFocusTarget = content.querySelector<HTMLElement>('[data-autofocus="true"]');
    const focusableElements = getFocusableElements(content);
    (autoFocusTarget ?? focusableElements[0] ?? content).focus();

    return () => {
      const fallbackTarget = fallbackTrigger ?? previousFocusedElement;
      fallbackTarget?.focus();
    };
  }, [contentRef, open, triggerRef]);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const currentContent = contentRef.current;
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
      if (!firstElement || !lastElement) {
        return;
      }

      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [contentRef, open, setOpen]);

  if (!open) {
    return null;
  }

  return (
    <Portal>
      <div className={styles.overlay} role="presentation">
        <button
          aria-hidden="true"
          className={styles.backdrop}
          onClick={() => {
            if (closeOnOverlayPress) {
              setOpen(false);
            }
          }}
          tabIndex={-1}
          type="button"
        />
        <div
          {...props}
          ref={mergeRefs(forwardedRef, contentRef)}
          aria-describedby={hasDescription ? descriptionId : undefined}
          aria-labelledby={hasTitle ? titleId : undefined}
          aria-modal="true"
          className={cx(className, styles.content, styles[size])}
          role="dialog"
          tabIndex={-1}
        >
          {children}
        </div>
      </div>
    </Portal>
  );
});

export type DialogTitleProps = Omit<React.HTMLAttributes<HTMLHeadingElement>, 'children'> & {
  children: React.ReactNode;
};

function DialogTitle({ children, className, id, ...props }: DialogTitleProps) {
  const { registerTitle, titleId } = useDialogContext('Dialog.Title');

  React.useEffect(() => registerTitle(), [registerTitle]);

  return (
    <h2 className={cx(className, styles.title)} id={id ?? titleId} {...props}>
      {children}
    </h2>
  );
}

export type DialogDescriptionProps = Omit<React.HTMLAttributes<HTMLParagraphElement>, 'children'> & {
  children: React.ReactNode;
};

function DialogDescription({ children, className, id, ...props }: DialogDescriptionProps) {
  const { descriptionId, registerDescription } = useDialogContext('Dialog.Description');

  React.useEffect(() => registerDescription(), [registerDescription]);

  return (
    <p className={cx(className, styles.description)} id={id ?? descriptionId} {...props}>
      {children}
    </p>
  );
}

export const DialogRoot = Object.assign(Dialog, {
  Trigger: DialogTrigger,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose
});