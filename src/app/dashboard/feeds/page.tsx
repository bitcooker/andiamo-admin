import React from "react";
import ClientOnly from "@/components/common/ClientOnly";
import FeedsClient from "./FeedsClient";

export default async function ChatsPage() {
  return (
    <ClientOnly>
      <FeedsClient />
    </ClientOnly>
  );
}
