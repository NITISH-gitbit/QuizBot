import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'primary', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'border-blue-500',
    secondary: 'border-indigo-500',
    white: 'border-white'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div 
        className={`
          ${sizeClasses[size]} 
          ${colorClasses[color]} 
          border-4 border-t-transparent 
          rounded-full 
          animate-spin
        `}
      />
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
