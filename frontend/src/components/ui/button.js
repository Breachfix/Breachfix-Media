'use client';
import React from 'react';
import clsx from 'clsx';

export const Button = ({ className, children, ...props }) => {
  return (
    <button
      className={clsx(
        'px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};