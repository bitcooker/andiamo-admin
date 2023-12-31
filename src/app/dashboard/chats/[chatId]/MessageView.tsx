"use client";

import React from "react";
import Image from "next/image";
import { Timestamp } from "firebase/firestore";

interface IMessageView {
  message: MessageType;
  photoURL?: string;
  advisorPhotoURL: string;
  advisorName: string;
  userName: string;
}

const MessageView: React.FC<IMessageView> = ({
  message,
  photoURL,
  advisorName,
  advisorPhotoURL,
  userName = "User",
}) => {
  const avatarUrl =
    message.role == "admin"
      ? advisorPhotoURL.length == 0
        ? "/images/user_avatar.jpg"
        : advisorPhotoURL
      : !photoURL || photoURL.length == 0
      ? "/images/user_avatar.jpg"
      : photoURL;
  return (
    <div
      className={`w-full flex ${
        message.role == "admin" ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <Image
        alt="User Avatar"
        width={48}
        height={48}
        src={avatarUrl}
        className="w-[48px] h-[48px] rounded-full object-cover aspect-square"
      />
      <div>
        <div
          className={`text-[16px] font-semibold mb-1 mx-3 ${
            message.role == "admin" ? "text-end" : "text-start"
          }`}
        >
          {message.role == "admin" ? advisorName : userName}
        </div>
        <div
          className={`p-3 mx-2 border border-zinc-200 ${
            message.role == "admin" ? "bg-cyan-100/20" : "bg-pink-100/20"
          } rounded-xl break-words`}
        >
          {message.text}
        </div>
        <div
          className={`text-[10px] mt-1 text-zinc-300 mx-3 ${
            message.role == "admin" && "text-end"
          }`}
        >
          {message.createdAt
            ? `${message.createdAt
                .toDate()
                .toLocaleDateString()} ${message.createdAt
                .toDate()
                .toLocaleTimeString()}`
            : "just now"}
        </div>
        <div className="flex flex-col items-center justify-center"></div>
      </div>
    </div>
  );
};

export default MessageView;
