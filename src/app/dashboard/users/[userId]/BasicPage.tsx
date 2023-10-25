"use client";
import React from "react";

interface IBasicPage {
  userId: string;
  user: UserType;
}

const BasicPage: React.FC<IBasicPage> = ({ userId, user }) => {
  return (
    <div>
      <h1 className="text-lg font-medium text-zinc-500">Basic Information</h1>
      <hr />

      <div className="flex items-center gap-5 mt-4">
        <div className="flex items-center gap-4">
          <div className="text-zinc-700 w-[90px]">First Name :</div>
          <div className="font-semibold text-[16px]">{user.firstName}</div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-zinc-700 w-[90px]">Last Name :</div>
          <div className="font-semibold text-[16px]">{user.lastName}</div>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-5">
        <div className="text-zinc-700 w-[90px]">Gender :</div>
        <div className="font-semibold text-[16px]">{user.gender}</div>
      </div>

      <h1 className="text-lg font-medium text-zinc-500 mt-8">
        Travel Experience
      </h1>
      <hr />
      <div className="text-[16px] mt-4">{user.experience}</div>
    </div>
  );
};

export default BasicPage;
