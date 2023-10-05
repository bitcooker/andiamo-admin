import React from "react";
import ClientOnly from "@/components/common/ClientOnly";
import UsersClient from "./UsersClient";

export default async function UsersPage() {
  return (
    <ClientOnly>
      <UsersClient />
    </ClientOnly>
  );
}
