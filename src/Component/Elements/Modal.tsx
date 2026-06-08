import { useEffect, useRef, useCallback, type ReactNode } from "react";
import "./Modal.css";

const modalSize = {
  sm: "max-w-xs",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  full: "w-full h-full",
} as const;

type ModalSize = keyof typeof modalSize;

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  size?: ModalSize;
}

function ModalForm({ children, onClose, size = "md" }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;

    const scrollbarWidth =
      typeof window !== "undefined"
        ? window.innerWidth - document.documentElement.clientWidth
        : 0;

    // Save current scroll position so it can restore it when closing.
    const scrollY =
      typeof window !== "undefined" ? window.scrollY || window.pageYOffset : 0;

    try {
      dlg.showModal();
      dlg.focus();
    } catch {
      // ignore if dialog is already open or showModal is not supported
    }

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      if (dlg.open) dlg.close();
      // Restore body styles and scroll position
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  const handleClose = (
    e:
      | React.MouseEvent<HTMLDialogElement>
      | React.KeyboardEvent<HTMLDialogElement>,
  ) => {
    if (
      e.target === dialogRef.current ||
      (e as React.KeyboardEvent).key === "Escape"
    ) {
      onClose();
    }
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <dialog
      ref={dialogRef}
      onClick={handleClose}
      className={`border border-gray-400 rounded ${modalSize[size]}`}
    >
      {children}
    </dialog>
  );
}

export default ModalForm;
