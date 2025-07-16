"use client";

import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        duration: 2000,
        style: {
          background: '#333',
          color: '#fff',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        },
        success: {
          style: {
            background: '#1976d2',
          },
        },
      }}
    />
  );
}
