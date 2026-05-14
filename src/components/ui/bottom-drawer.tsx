"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function BottomDrawer({
  open,
  onClose,
  title,
  children,
  footer,
  className,
}: BottomDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] md:hidden">
          <motion.button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 bg-black/45 cursor-default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
              "absolute left-0 right-0 bottom-0 bg-white rounded-t-2xl shadow-lg flex flex-col max-h-[90vh]",
              className,
            )}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.32, ease: [0.22, 0.68, 0.35, 1] as const }}
          >
            <div className="pt-3 pb-2 flex items-center justify-center shrink-0">
              <div className="h-1 w-10 bg-gray-200 rounded-full" />
            </div>
            <div className="px-4 pb-3 flex items-center justify-between shrink-0">
              <h3 className="text-[16px] leading-6 font-semibold text-gray-900">
                {title}
              </h3>
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex items-center justify-center w-8 h-8 -mr-1 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="h-px bg-gray-200 shrink-0" />
            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
              {children}
            </div>
            {footer && (
              <>
                <div className="h-px bg-gray-200 shrink-0" />
                <div
                  className="p-4 shrink-0"
                  style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
                >
                  {footer}
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
