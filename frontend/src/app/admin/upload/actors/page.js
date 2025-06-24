
"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const ActorUploadForm = dynamic(() => import('@/components/upload/forms/ActorUploadForm'), {
  ssr: false,
});

const ActorUploadPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Upload New Company</h1>
      <ActorUploadForm />
    </div>
  );
};

export default ActorUploadPage;