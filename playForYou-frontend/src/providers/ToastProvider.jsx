import { createContext, useContext, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function dismissToast(id) {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }

  function showToast(message, tone = "info") {
    const id = crypto.randomUUID();
    setToasts((currentToasts) => [...currentToasts, { id, message, tone }]);
    window.setTimeout(() => dismissToast(id), 3200);
  }

  const value = useMemo(() => ({ showToast, dismissToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-viewport">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              className={`toast-card toast-${toast.tone}`}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
              <span>{toast.message}</span>
              <button type="button" onClick={() => dismissToast(toast.id)}>
                Close
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
