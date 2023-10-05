import React from "react";
import ChatClient from "./ChatClient";
import ClientOnly from "@/components/common/ClientOnly";

interface IPageParams {
  params: {
    chatId: string;
  };
}

export default function ChatPage({ params }: IPageParams) {
  return (
    <ClientOnly>
      <ChatClient chatId={params.chatId} />
    </ClientOnly>
  );
}
