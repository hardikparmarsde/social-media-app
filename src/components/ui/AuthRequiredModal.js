import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from './motion';

const AuthRequiredModal = ({
  open,
  onClose,
  message = 'You are not authenticated.',
  ctaLabel = 'Sign in',
  ctaTo = '/auth/login',
  ctaState,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onClose?.()}
        >
          <motion.div
            className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950"
            initial={{ y: 10, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M8 0a5 5 0 0 0-5 5v2.086a2 2 0 0 0-.586 1.414V12a2 2 0 0 0 2 2h7.172a2 2 0 0 0 2-2V8.5a2 2 0 0 0-.586-1.414V5a5 5 0 0 0-5-5Zm-4 5a4 4 0 1 1 8 0v1.5H4V5Z" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-base font-bold text-slate-900 dark:text-slate-50">Sign in required</div>
                <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">{message}</div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button type="button" className="btn btn-ghost" onClick={() => onClose?.()}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  onClose?.();
                  navigate(ctaTo, { state: ctaState });
                }}
              >
                {ctaLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthRequiredModal;

