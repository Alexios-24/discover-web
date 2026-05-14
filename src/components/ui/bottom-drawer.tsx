"use client";

import { useEffect } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  hideCloseButton?: boolean;
  hideHeaderDivider?: boolean;
}

export function BottomDrawer({
  open,
  onClose,
  title,
  children,
  footer,
  className,
  hideCloseButton,
  hideHeaderDivider,
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

  const dragControls = useDragControls();

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
            drag="y"
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 500) {
                onClose();
              }
            }}
            className={cn(
              "absolute left-0 right-0 bottom-0 bg-white rounded-t-[8px] shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)] border border-gray-100 flex flex-col max-h-[90vh]",
              className,
            )}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.32, ease: [0.22, 0.68, 0.35, 1] as const }}
          >
            <div
              className="pt-3 px-4 flex flex-col gap-2 shrink-0 touch-none cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="h-2 w-[69px] bg-gray-200 rounded-full self-center" />
              <div className="flex items-center justify-between">
                <h3 className="text-[16px] leading-6 font-semibold text-gray-900 tracking-normal">
                  {title}
                </h3>
                {!hideCloseButton && (
                  <button
                    onClick={onClose}
                    onPointerDown={(e) => e.stopPropagation()}
                    aria-label="Close"
                    className="flex items-center justify-center w-8 h-8 -mr-1 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>
            {!hideHeaderDivider && <div className="h-px bg-gray-200 shrink-0" />}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
              {children}
            </div>
            {footer && (
              <>
                <div className="h-px bg-gray-200 shrink-0" />
                <div
                  className="px-4 pt-3 shrink-0"
                  style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
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
