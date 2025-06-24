"use client";

import dynamic from 'next/dynamic';

const UploadForm = dynamic(() => import('@/components/upload/forms/UploadForm'), {
  ssr: false,
});

export default function UploadMoviePage() {
  return <UploadForm contentType="episode" />; 
}