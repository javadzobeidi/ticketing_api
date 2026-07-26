import React, { useEffect } from 'react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertModalProps {
  type?: AlertType;
  message: string;
  onClose?: () => void;
  show?: boolean;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const AlertModal: React.FC<AlertModalProps> = ({ 
  type = 'success', 
  message, 
  onClose, 
  show = true, 
  autoClose = false, 
  autoCloseDelay = 3000 
}) => {
  useEffect(() => {
    if (show && autoClose) {
      const timer = setTimeout(() => {
        onClose?.();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [show, autoClose, autoCloseDelay, onClose]);

  if (!show) return null;

  const typeClasses: Record<AlertType, string> = {
    success: "bg-green-500",
    error: "bg-red-500", 
    warning: "bg-yellow-500",
    info: "bg-blue-500"
  };

  const iconClasses: Record<AlertType, string> = {
    success: "text-green-100",
    error: "text-red-100", 
    warning: "text-yellow-100",
    info: "text-blue-100"
  };

  const icons: Record<AlertType, JSX.Element> = {
    success: (
      <svg className="w-16 h-16 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    error: (
      <svg className="w-16 h-16 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-16 h-16 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    info: (
      <svg className="w-16 h-16 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  const typeTitles: Record<AlertType, string> = {
    success: 'موفقیت!',
    error: 'خطا!',
    warning: 'هشدار!',
    info: 'اطلاعات!'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Header with colored background */}
        <div className={`${typeClasses[type]} rounded-t-2xl p-6 text-center`}>
          <div className={`${iconClasses[type]} flex justify-center mb-4`}>
            {icons[type]}
          </div>
          <h3 className="text-xl font-bold text-white">
            {typeTitles[type]}
          </h3>
        </div>
        
        {/* Content */}
        <div className="p-6 text-center">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            {message}
          </p>
          
          {/* Action buttons */}
          <div className="flex gap-3 justify-center">
            {onClose && (
              <button
                onClick={onClose}
                type="button"
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  type === 'success' 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : type === 'error'
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : type === 'warning'
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                بستن
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;