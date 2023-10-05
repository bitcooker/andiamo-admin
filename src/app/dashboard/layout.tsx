import React from "react";
import ClientOnly from "@/components/common/ClientOnly";
import Authenticated from "@/components/hocs/Authenticated";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen flex bg-zinc-100">
      <ClientOnly>
        <Authenticated>
          <Sidebar />
        </Authenticated>
      </ClientOnly>
      <div className="bg-zinc-100 flex flex-col flex-grow-0 w-full min-h-screen">
        <ClientOnly>
          <Navbar />
        </ClientOnly>
        <div className="p-5 flex flex-col h-full flex-grow">{children}</div>
      </div>
    </div>
  );
}
