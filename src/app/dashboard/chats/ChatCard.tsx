"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AiFillMessage } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";

interface IChatCard {
  chat: SimpleChatType;
}

const ChatCard: React.FC<IChatCard> = ({ chat }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userDocUnsub = onSnapshot(
      doc(firestore, "users", chat.userUid),
      (userDoc: any) => {
        const _user = userDoc.data() as UserType;
        setUser(_user);
      }
    );
  }, []);

  const handleOpenChat = () => {
    router.push(`/dashboard/chats/${chat.id}`);
  };

  return (
    <div
      className="w-full lg:max-w-[500px] bg-white p-4 rounded-lg flex cursor-pointer hover:shadow active:scale-[98%] transition-all"
      onClick={handleOpenChat}
    >
      <Image
        alt="Chat Image"
        width={100}
        height={100}
        src={
          chat.image.length == 0 ? "/images/image_placeholder.png" : chat.image
        }
        className="w-[100px] h-[100px] rounded-md border object-cover aspect-square"
      />
      <div className="ml-5 flex flex-col justify-between py-2 w-full">
        <h3>{chat.title}</h3>
        <div className="bg-slate-100 h-[1px] -mt-4"></div>
        <div className="flex justify-between items-center">
          {user ? (
            <div className="flex items-center gap-2">
              <Image
                alt="User Avatar"
                width={32}
                height={32}
                src={
                  user.photoURL.length == 0
                    ? "/images/user_avatar.jpg"
                    : user.photoURL
                }
                className="rounded-full border object-cover aspect-square"
              />
              <div className="text-[14px] text-zinc-500 font-semibold">
                {`${user.firstName} ${user.lastName}`}
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="w-[100px] h-[18px] rounded-md" />
            </div>
          )}

          <div className="flex items-start gap-2">
            {chat.adminUnreads > 0 && (
              <MessageBadge unreads={chat.adminUnreads} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MessageBadge: React.FC<{ unreads: number }> = ({ unreads }) => {
  return (
    <div className="relative text-zinc-300">
      <AiFillMessage size={22} />
      <span className="absolute top-0 right-0 text-xs rounded-full bg-rose-500 w-4 h-4 flex items-center justify-center text-white translate-x-[30%] translate-y-[-30%]">
        {unreads}
      </span>
    </div>
  );
};

export default ChatCard;
