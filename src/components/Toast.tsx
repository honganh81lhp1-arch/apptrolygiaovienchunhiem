import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  text: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div id="toast-container" className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => {
        let borderClass = 'border-l-4 border-blue-500 text-blue-900 bg-white';
        let Icon = Info;
        let iconColor = 'text-blue-500';

        if (toast.type === 'success') {
          borderClass = 'border-l-4 border-emerald-500 text-slate-800 bg-white';
          Icon = CheckCircle2;
          iconColor = 'text-emerald-500';
        } else if (toast.type === 'error') {
          borderClass = 'border-l-4 border-rose-500 text-slate-800 bg-white';
          Icon = AlertCircle;
          iconColor = 'text-rose-500';
        } else if (toast.type === 'warning') {
          borderClass = 'border-l-4 border-amber-500 text-slate-800 bg-white';
          Icon = AlertTriangle;
          iconColor = 'text-amber-500';
        }

        return (
          <div
            key={toast.id}
            className={`${borderClass} shadow-lg rounded-r-lg px-4 py-3 flex items-start gap-3 pointer-events-auto border border-slate-100 transition-all duration-300 animate-in fade-in slide-in-from-top-2`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <p className="text-sm font-medium flex-1 leading-snug">{toast.text}</p>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-600 transition p-0.5"
              aria-label="Đóng thông báo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
