'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <Suspense fallback={<div>Loading error...</div>}>
        <ActualErrorPage />
      </Suspense>
    </div>
  );
}

function ActualErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">⚠️ Authentication Error</h1>
      <p className="text-red-400">{error || 'Something went wrong during login.'}</p>
      <a href="/auth/login" className="block mt-6 text-blue-400 underline">
        Return to Login
      </a>
    </div>
  );
}