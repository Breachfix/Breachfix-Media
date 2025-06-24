'use client';
import React from 'react';
import clsx from 'clsx';

export const Textarea = ({ className, ...props }) => {
  return (
    <textarea
      className={clsx(
        'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500',
        className
      )}
      rows={4}
      {...props}
    />
  );
};