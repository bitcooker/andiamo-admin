"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountPage from "./AccountPage";
import ChatsPage from "./ChatsPage";
import TripsPage from "./TripsPage";
import { onSnapshot, doc } from "firebase/firestore";
import { firestore } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";

interface IUsersClient {
  userId: string;
}

const UserClient: React.FC<IUsersClient> = ({ userId }) => {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const userDocUnsub = onSnapshot(
      doc(firestore, "users", userId),
      (_userDoc) => {
        const _user = _userDoc.data() as UserType;
        setUser(_user);
      }
    );
  }, []);

  return (
    <div className="flex flex-col lg:flex-row md:gap-5 items-start">
      <div className="w-full lg:w-[25%] lg:mt-14">
        <div className="mx-auto bg-white border border-zinc-200/80 w-full lg:w-[160px] rounded-xl py-5">
          {user ? (
            <Image
              src={
                user.photoURL == "" ? "/images/user_avatar.jpg" : user.photoURL
              }
              alt="User Photo"
              width={96}
              height={96}
              className="w-[96px] h-[96px] mx-auto border shadow-[0_5px_10px_rgb(0,0,0,0.03)] object-cover aspect-square rounded-full"
            />
          ) : (
            <Skeleton className="w-[96px] h-[96px] mx-auto border shadow-[0_5px_10px_rgb(0,0,0,0.03)] rounded-full bg-zinc-200/50" />
          )}
          {user ? (
            <>
              <div className="mt-5 text-center text-lg font-semibold">
                {user.name}
              </div>
              <div className="text-center text-xs text-zinc-500 mx-auto lg:max-w-[130px] break-words">
                {user.email}
              </div>
            </>
          ) : (
            <>
              <Skeleton className="w-[100px] mx-auto mt-5 h-[16px] rounded-md bg-zinc-200/50" />
              <Skeleton className="w-[100px] mx-auto mt-1 h-[13px] rounded-md bg-zinc-200/40" />
            </>
          )}
        </div>
      </div>
      <Tabs defaultValue="account" className="flex-grow w-full mt-5 lg:mt-0">
        <TabsList className="mx-auto max-w-[350px] h-[60px] p-2 grid grid-cols-3 bg-white/30">
          <TabsTrigger value="account" className="text-lg">
            Account
          </TabsTrigger>
          <TabsTrigger value="chats" className="text-lg">
            Chats
          </TabsTrigger>
          <TabsTrigger value="trips" className="text-lg">
            Trips
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="mt-6">
          {user && <AccountPage userId={userId} user={user} />}
        </TabsContent>
        <TabsContent value="chats">
          {user && <ChatsPage userId={userId} user={user} />}
        </TabsContent>
        <TabsContent value="trips">
          <TripsPage userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserClient;
