// app/admin/upload/actors/page.js
"use client";

import dynamic from 'next/dynamic';

const ActorUploadForm = dynamic(() => import('@/components/upload/forms/ActorUploadForm'), {
  ssr: false,
});

export default function UploadActorPage() {
  return <ActorUploadForm contentType="actor" />;
}