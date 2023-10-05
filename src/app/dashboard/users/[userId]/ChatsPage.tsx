"user client";

import { firestore } from "@/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import ChatCard from "../../chats/ChatCard";
import { Skeleton } from "@/components/ui/skeleton";

interface IChatsPage {
  userId: string;
  user: UserType;
}

const ChatsPage: React.FC<IChatsPage> = ({ userId, user }) => {
  const [chats, setChats] = useState<SimpleChatType[] | null>(null);

  useEffect(() => {
    const chatsUnsub = onSnapshot(
      query(collection(firestore, "chats"), where("userUid", "==", userId)),
      (_data) => {
        const _chats: SimpleChatType[] = [];
        _data.docs.map((_doc) => {
          _chats.push(_doc.data() as SimpleChatType);
        });

        setChats(_chats);
      }
    );
  }, []);

  return (
    <div>
      <h1 className="text-lg font-medium text-zinc-500">{`${user.name}'s Chats`}</h1>
      <hr />
      <div className="flex flex-col gap-3 mt-5">
        {chats ? (
          chats.length > 0 ? (
            chats.map((_chat, index) => <ChatCard chat={_chat} key={index} />)
          ) : (
            <div className="text-sm text-zinc-300">No chats</div>
          )
        ) : (
          <>
            <Skeleton className="w-full h-[130px] max-w-[500px] rounded-md bg-zinc-200/50" />
            <Skeleton className="w-full h-[130px] max-w-[500px] rounded-md bg-zinc-200/50 opacity-30" />
            <Skeleton className="w-full h-[130px] max-w-[500px] rounded-md bg-zinc-200/50 opacity-10" />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatsPage;
