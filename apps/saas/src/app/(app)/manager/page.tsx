import { Suspense } from "react";
import ManagerClient from "./manager-client";

export const dynamic = "force-static";

export default function ManagerPage() {
  return (
    <Suspense fallback={null}>
      <ManagerClient />
    </Suspense>
  );
}
