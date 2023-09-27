import ClientOnly from "@/components/common/ClientOnly";
import React from "react";
import HomeClient from "./HomeClient";

export default function Home() {
  return (
    <ClientOnly>
      <HomeClient />
    </ClientOnly>
  );
}
