
"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const CompanyUploadForm = dynamic(() => import('@/components/upload/forms/CompanyUploadForm'), {
  ssr: false,
});

const CompanyUploadPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Upload New Company</h1>
      <CompanyUploadForm />
    </div>
  );
};

export default CompanyUploadPage;
