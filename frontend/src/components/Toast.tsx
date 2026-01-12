import { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning';

interface ToastProps {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: () => void;
}

export default function Toast({ type, title, message, duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    // Solo auto-cerrar si duration > 0
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-500',
      text: 'text-green-800',
      icon: CheckCircle2,
      iconColor: 'text-green-600'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      text: 'text-red-800',
      icon: XCircle,
      iconColor: 'text-red-600'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-500',
      text: 'text-yellow-800',
      icon: AlertCircle,
      iconColor: 'text-yellow-600'
    }
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4 animate-slide-down">
      <div className={`${style.bg} border-2 ${style.border} rounded-lg p-4 shadow-2xl`}>
        <div className="flex items-start gap-3">
          <Icon className={`w-6 h-6 ${style.iconColor} flex-shrink-0 mt-0.5`} />
          
          <div className="flex-1 min-w-0">
            <p className={`${style.text} font-bold text-base`}>
              {title}
            </p>
            {message && (
              <p className={`${style.text} text-sm mt-1 opacity-90`}>
                {message}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className={`${style.text} hover:opacity-70 transition-opacity flex-shrink-0`}
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de progreso */}
        {duration > 0 && (
          <div className="mt-3 h-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className={`h-full ${style.border.replace('border-', 'bg-')} transition-all ease-linear`}
              style={{
                animation: `progress ${duration}ms linear`
              }}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translate(-50%, -100%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
