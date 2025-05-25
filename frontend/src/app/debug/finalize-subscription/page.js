// app/debug/finalize-subscription/page.jsx
import { Suspense } from "react";
import FinalizeSubscriptionClient from "./FinalizeSubscriptionClient";

export const dynamic = "force-dynamic"; // ensure dynamic SSR for session params

export default function FinalizeSubscriptionPage() {
  return (
    <Suspense fallback={<div className="text-white p-10">⏳ Finalizing subscription...</div>}>
      <FinalizeSubscriptionClient />
    </Suspense>
  );
}