import React from "react";
import ClientOnly from "@/components/common/ClientOnly";
import UserClient from "./UserClient";

interface IPageParams {
  params: {
    userId: string;
  };
}

export default function ChatPage({ params }: IPageParams) {
  return (
    <ClientOnly>
      <UserClient userId={params.userId} />
    </ClientOnly>
  );
}
