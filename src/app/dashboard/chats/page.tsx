import React from "react";
import ClientOnly from "@/components/common/ClientOnly";
import ChatsClient from "./ChatsClient";

export default async function ChatsPage() {
  return (
    <ClientOnly>
      <ChatsClient />
    </ClientOnly>
  );
}
