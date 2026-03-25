import { useEffect, useRef, useCallback, type ReactNode } from "react";
import "./Modal.css";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

function ModalForm({ children, onClose }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;

    const scrollbarWidth =
      typeof window !== "undefined"
        ? window.innerWidth - document.documentElement.clientWidth
        : 0;

    try {
      dlg.showModal();
    } catch {
      // ignore if dialog is already open or showModal is not supported
    }

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      if (dlg.open) dlg.close();
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
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
      className="border border-gray-400 rounded w-full max-w-2xl m-0"
    >
      {children}
    </dialog>
  );
}

export default ModalForm;
