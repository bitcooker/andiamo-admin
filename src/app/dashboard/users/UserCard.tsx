"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface IUserCard {
  user: UserType;
}

const UserCard: React.FC<IUserCard> = ({ user }) => {
  const router = useRouter();

  const handleOpenUserDetails = () => {
    router.push(`/dashboard/users/${user.id}`);
  };

  return (
    <div
      onClick={handleOpenUserDetails}
      className="p-2 border bg-white rounded-lg cursor-pointer shadow hover:shadow-[0_8px_14px_rgb(0,0,0,0.05)] hover:scale-105 active:scale-100 transition-all"
    >
      <Image
        alt="User Photo"
        src={user.photoURL}
        width={96}
        height={96}
        className="w-[96px] h-[96px] aspect-square object-cover rounded-lg"
      />
      <div className="text-sm text-center mt-2">{user.name}</div>
    </div>
  );
};

export default UserCard;
