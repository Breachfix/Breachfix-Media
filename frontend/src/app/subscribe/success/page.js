import { Suspense } from "react";
import SubscribeSuccessClient from "./SubscribeSuccessClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white p-10">⏳ Loading...</div>}>
      <SubscribeSuccessClient />
    </Suspense>
  );
}