'use client';
import React from 'react';

export const Label = ({ className, children, ...props }) => {
  return (
    <label className={`block text-sm font-medium mb-1 ${className}`} {...props}>
      {children}
    </label>
  );
};