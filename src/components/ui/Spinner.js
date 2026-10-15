import React from 'react';

const sizeMap = {
  xs: 'h-3 w-3 border',
  sm: 'h-4 w-4 border-2',
  md: 'h-5 w-5 border-2',
  lg: 'h-8 w-8 border-[3px]',
};

const Spinner = ({ size = 'sm', className = '' }) => {
  const s = sizeMap[size] || sizeMap.sm;
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block ${s} animate-spin rounded-full border-current border-t-transparent ${className}`}
    />
  );
};

export default Spinner;
