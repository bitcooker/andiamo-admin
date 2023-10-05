"use client";
import Rect, { useEffect, useState } from "react";
import { firestore } from "@/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import ChatCard from "./ChatCard";
import { Skeleton } from "@/components/ui/skeleton";

interface IChatsClient {}

const ChatsClient: React.FC<IChatsClient> = ({}) => {
  const [chatsData, loading, error] = useCollection(
    collection(firestore, "chats"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  return (
    <div>
      <h1 className="text-2xl">Chats</h1>
      <div className="mt-5 grid grid-cols-5">
        <div className="flex flex-col gap-3 col-span-5 lg:col-span-3">
          {!loading ? (
            chatsData &&
            chatsData.docs.map((chatData, index) => (
              <ChatCard
                chat={{
                  ...(chatData.data() as SimpleChatType),
                  id: chatData.id,
                }}
                key={index}
              />
            ))
          ) : (
            <>
              <Skeleton className="w-full h-[130px] max-w-[500px] rounded-md bg-zinc-200/50" />
              <Skeleton className="w-full h-[130px] max-w-[500px] rounded-md bg-zinc-200/50 opacity-30" />
              <Skeleton className="w-full h-[130px] max-w-[500px] rounded-md bg-zinc-200/50 opacity-10" />
            </>
          )}
        </div>
        <div className="col-span-2"></div>
      </div>
    </div>
  );
};

export default ChatsClient;
