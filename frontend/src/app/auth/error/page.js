'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ActualErrorPage />
    </Suspense>
  );
}

function ActualErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="text-white p-8">
      <h1 className="text-3xl font-semibold">Auth Error</h1>
      <p className="mt-4 text-red-400">{error || 'Something went wrong.'}</p>
    </div>
  );
}