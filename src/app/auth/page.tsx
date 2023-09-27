import React from "react";
import ClientOnly from "@/components/common/ClientOnly";
import LoginClient from "./LoginClient";

export default async function AuthPage() {
  return (
    <ClientOnly>
      <LoginClient />
    </ClientOnly>
  );
}
