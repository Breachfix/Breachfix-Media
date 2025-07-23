
// app/admin/upload/actors/page.js
"use client";

import dynamic from 'next/dynamic';

const CompanyUploadForm = dynamic(() => import('@/components/upload/forms/CompanyUploadForm'), {
  ssr: false,
});

export default function UploadActorPage() {
  return <CompanyUploadForm contentType="actor" />;
}