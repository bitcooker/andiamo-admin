"use client";

import React from "react";
import { firestore } from "@/firebase";
import { collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { Input } from "@/components/ui/input";
import { PiMagnifyingGlassLight } from "react-icons/pi";
import { Skeleton } from "@/components/ui/skeleton";
import UserCard from "./UserCard";

interface IUsersClient {}

const UsersClient: React.FC<IUsersClient> = ({}) => {
  const [usersData, loading, error] = useCollection(
    collection(firestore, "users"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  return (
    <div>
      <h1 className="text-2xl">Users</h1>
      <div className="mt-5 flex items-center mx-auto">
        <PiMagnifyingGlassLight size={24} className="mr-2 text-zinc-500" />
        <Input
          type="search"
          placeholder="Search Users..."
          name="searchText"
          className="md:w-[300px] lg:w-[450px]"
        />
      </div>
      <div className="mt-5 flex flex-wrap gap-8">
        {!loading ? (
          usersData &&
          usersData.docs.map((userData, index) => (
            <UserCard
              user={{
                ...(userData.data() as UserType),
                id: userData.id,
              }}
              key={index}
            />
          ))
        ) : (
          <>
            <Skeleton className="w-[160px] h-[160px] rounded-md bg-zinc-200/50" />
            <Skeleton className="w-[160px] h-[160px] rounded-md bg-zinc-200/30" />
            <Skeleton className="w-[160px] h-[160px] rounded-md bg-zinc-200/10" />
          </>
        )}
      </div>
    </div>
  );
};

export default UsersClient;
