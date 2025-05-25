"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function FinalizeSubscriptionClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!sessionId) return;

    const finalize = async () => {
      try {
        const res = await fetch(`/api/stripe/finalize-subscription?session_id=${sessionId}`);
        const data = await res.json();
        setResult(data);
        console.log("🧾 Finalization result:", data);
      } catch (err) {
        console.error("❌ Error finalizing:", err);
        setResult({ error: err.message });
      }
    };

    finalize();
  }, [sessionId]);

  return (
    <div className="p-10 text-white">
      <h1 className="text-2xl font-bold mb-4">🔧 Finalize Subscription Debug Page</h1>
      {result ? (
        <pre className="bg-black bg-opacity-50 p-4 rounded-lg overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      ) : (
        <p className="text-gray-400">Waiting for session ID...</p>
      )}
    </div>
  );
} 
