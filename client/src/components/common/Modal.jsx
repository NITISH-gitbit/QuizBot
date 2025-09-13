import React from 'react';
import { motion } from 'framer-motion';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = 'max-w-md',
  showCloseButton = true 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-screen items-start sm:items-center justify-center p-2 sm:p-4">
        <motion.div 
          className={`
            relative w-full ${maxWidth} 
            bg-white rounded-lg sm:rounded-xl shadow-xl
            transform transition-all
            max-h-[95vh] overflow-y-auto
            my-2 sm:my-4
          `}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-4 sm:p-6 border-b">
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="
                    text-gray-400 hover:text-gray-600 
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    rounded-lg p-1 transition-colors
                  "
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="p-4 sm:p-6">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Modal;
