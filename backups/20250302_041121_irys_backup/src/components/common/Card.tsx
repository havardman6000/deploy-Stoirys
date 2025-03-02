import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string | React.ReactNode;
  className?: string;
  headerActions?: React.ReactNode;
  noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  title, 
  className = '',
  headerActions,
  noPadding = false
}) => {
  return (
    <div className={`bg-white rounded-lg border border-border-light overflow-hidden ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-border-light flex justify-between items-center">
          {typeof title === 'string' ? (
            <h3 className="text-lg font-medium text-text-primary">{title}</h3>
          ) : (
            title
          )}
          {headerActions && (
            <div className="flex items-center space-x-2">
              {headerActions}
            </div>
          )}
        </div>
      )}
      <div className={noPadding ? '' : 'p-6'}>{children}</div>
    </div>
  );
};

export default Card; 