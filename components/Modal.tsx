"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative bg-light-secondary dark:bg-dark-secondary border-[5px] border-light-border dark:border-dark-border shadow-brutal-card rounded-[20px] overflow-hidden flex flex-col w-[90vw] max-w-2xl max-h-[80vh]"
        role="dialog"
        aria-modal="true"
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b-[5px] border-light-border dark:border-dark-border bg-light-primary dark:bg-dark-primary">
            <h2 className="font-black text-xl uppercase tracking-tight text-light-text dark:text-dark-text">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center border-[3px] border-light-border dark:border-dark-border bg-light-secondary dark:bg-dark-secondary rounded-xl shadow-brutal-badge hover:shadow-brutal-button transition-all"
            >
              <X className="w-5 h-5 stroke-[3] text-light-text dark:text-dark-text" />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {children}
        </div>
      </div>
    </div>
  );
}
