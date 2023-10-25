"use client";
import Rect, { useEffect, useState } from "react";
import { firestore } from "@/firebase";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import ChatCard from "./ChatCard";
import { Skeleton } from "@/components/ui/skeleton";

interface IChatsClient {}

const ChatsClient: React.FC<IChatsClient> = ({}) => {
  const [chats, setChats] = useState<SimpleChatType[] | null>(null);

  useEffect(() => {
    const tripsUnsub = onSnapshot(
      query(collection(firestore, "chats")),
      (_data) => {
        const _chats: SimpleChatType[] = [];
        _data.docs.map((_doc) => {
          _chats.push({ ...(_doc.data() as SimpleChatType), id: _doc.id });
        });

        setChats(_chats);
      }
    );
  }, []);

  return (
    <div>
      <h1 className="text-2xl">Chats</h1>
      <div className="mt-5 grid grid-cols-5">
        <div className="flex flex-col gap-3 col-span-5 lg:col-span-3">
          {chats != null ? (
            chats.map((chat, index) => <ChatCard chat={chat} key={index} />)
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
