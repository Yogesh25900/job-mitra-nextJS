"use client";
import React, { createContext, useContext, useCallback, useState, ReactNode } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  title: string;
  message: string;
  type?: ToastType;
  icon?: ReactNode;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, "id">) => {
    setToasts((prev) => {
      // Prevent duplicates (same title+message+type)
      if (prev.some(t => t.title === toast.title && t.message === toast.message && t.type === toast.type)) {
        return prev;
      }
      const id = Math.random().toString(36).substr(2, 9);
      return [...prev, { ...toast, id }];
    });
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 items-end">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  React.useEffect(() => {
    if (toast.duration === 0) return;
    const timer = setTimeout(onClose, toast.duration ?? 4000);
    return () => clearTimeout(timer);
  }, [toast.duration, onClose]);

  let icon = toast.icon;
  if (!icon) {
    if (toast.type === "success") icon = <span className="material-symbols-outlined text-green-500">check_circle</span>;
    else if (toast.type === "error") icon = <span className="material-symbols-outlined text-red-500">error</span>;
    else if (toast.type === "info") icon = <span className="material-symbols-outlined text-blue-500">info</span>;
    else if (toast.type === "warning") icon = <span className="material-symbols-outlined text-yellow-500">warning</span>;
  }

  return (
    <div
      className={`relative flex items-start gap-3 px-5 py-4 rounded-lg shadow-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 min-w-[280px] max-w-xs animate-fade-in-out`}
      role="alert"
      tabIndex={0}
    >
      <div className="mt-1">{icon}</div>
      <div className="flex-1">
        <div className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{toast.title}</div>
        <div className="text-slate-600 dark:text-slate-300 text-xs">{toast.message}</div>
      </div>
      <button
        onClick={onClose}
        className="ml-2 text-slate-400 hover:text-slate-700 dark:hover:text-white focus:outline-none"
        aria-label="Close notification"
      >
        <span className="material-symbols-outlined text-base">close</span>
      </button>
      <style jsx>{`
        .animate-fade-in-out {
          animation: fadeIn 0.25s, fadeOut 0.25s 3.75s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
