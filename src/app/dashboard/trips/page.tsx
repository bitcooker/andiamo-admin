import React from "react";
import ClientOnly from "@/components/common/ClientOnly";
import TripsClient from "./TripsClient";

export default async function ChatsPage() {
  return (
    <ClientOnly>
      <TripsClient />
    </ClientOnly>
  );
}
