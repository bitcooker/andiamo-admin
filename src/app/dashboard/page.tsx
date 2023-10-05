import React from "react";
import ClientOnly from "@/components/common/ClientOnly";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  return (
    <ClientOnly>
      <DashboardClient />
    </ClientOnly>
  );
}
