"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageView from "./MessageView";
import { firestore, storage } from "@/firebase";
import {
  UploadTask,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { useDocument } from "react-firebase-hooks/firestore";
import {
  DocumentReference,
  addDoc,
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { IoAddCircleOutline } from "react-icons/io5";
import { Skeleton } from "@/components/ui/skeleton";
import ImageInput from "@/components/common/image-input/ImageInput";

interface IChatClient {
  chatId: string;
}

const ChatClient: React.FC<IChatClient> = ({ chatId }) => {
  const [isInit, setIsInit] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);
  const [chat, setChat] = useState<SimpleChatType | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [isUpdating, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState<any>(undefined);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chatDocUnsub = onSnapshot(
      doc(firestore, "chats", chatId),
      (chatDoc: any) => {
        const _chat = chatDoc.data() as SimpleChatType;
        setChat(_chat);

        const userDocUnsub = onSnapshot(
          doc(firestore, "users", _chat.userUid),
          (userDoc: any) => {
            const _user = userDoc.data() as UserType;
            setUser(_user);
          }
        );
      }
    );

    const messagesUnsub = onSnapshot(
      query(
        collection(firestore, "chats", chatId, "messages"),
        orderBy("createdAt", "asc")
      ),
      (_data) => {
        const _messages: MessageType[] = [];
        _data.docs.map((_doc) => {
          _messages.push(_doc.data() as MessageType);
        });

        setMessages(_messages);
      }
    );
  }, []);

  useEffect(() => {
    updateDoc(doc(firestore, "chats", chatId), {
      adminUnreads: 0,
    });
  }, [messages]);

  useEffect(() => {
    if (chat && isInit) {
      setImage(chat.image);
      setTitle(chat.title);
      setIsInit(false);
    }
  }, [chat]);

  const sendMessage = () => {
    if (text != "") {
      setIsSending(true);

      updateDoc(doc(firestore, "chats", chatId), {
        userUnreads: chat!.userUnreads + 1,
      });

      addDoc(collection(firestore, "chats", chatId, "messages"), {
        text: text,
        role: "admin",
        createdAt: serverTimestamp(),
      })
        .then(() => {
          setText("");
          setIsSending(false);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Something went wrong :(");
        });
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages]);

  const handleImageChange = (value: any) => {
    if (value) {
      setImageFile(value);
      setImage(URL.createObjectURL(value));
    } else {
      setImageFile(null);
      setImage("");
    }
  };

  const handleUpdate = () => {
    setIsUploading(true);
    updateChatData()
      .then(() => {})
      .catch((err: any) => {
        toast.error("Something went wrong :(");
        console.error(err.message);
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  const updateChatData = async () => {
    // Image Deleting
    if (
      (chat!.image !== "" && image == "") ||
      (chat!.image !== "" && image != chat!.image)
    ) {
      const deleteImageRef = ref(storage, chat!.image);
      await deleteObject(deleteImageRef);

      setImage("");

      await updateDoc(doc(firestore, "chats", chatId), {
        image: "",
      });
    }

    if (imageFile) {
      // Image Upload
      const uploadRef = ref(storage, `/images/chats/${imageFile.name}`);

      const snapshot = await uploadBytes(uploadRef, imageFile);
      const url = await getDownloadURL(snapshot.ref);
      await updateDoc(doc(firestore, "chats", chatId), {
        image: url,
      });

      setImage(url);
      setImageFile(null);
    }

    // Title Update
    await updateDoc(doc(firestore, "chats", chatId), {
      title: title,
    });
  };

  const handleReset = () => {
    setImage(chat!.image);
    setTitle(chat!.title);
    setImageFile(null);
  };

  return (
    <div className="w-full h-full grid grid-cols-2 gap-14 lg:gap-1">
      <div className="col-span-2 lg:col-span-1">
        <div className="flex flex-col h-full justify-center w-full max-w-[500px] p-3 mx-auto">
          <div className="bg-white flex flex-col rounded-xl shadow-[rgba(0,_0,_0,_0.18)_0px_3px_3px] p-1 justify-between">
            <div className="flex flex-col flex-grow bg-zinc-50 p-1 m-1 rounded-md">
              <div className="h-[600px] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-100 scrollbar-thumb-rounded-full w-full p-1">
                <div
                  ref={scrollRef}
                  className="flex flex-col gap-7 px-2 pb-[100px]"
                >
                  {chat ? (
                    <>
                      {messages.map((_message, index) => (
                        <MessageView
                          key={index}
                          message={_message}
                          photoURL={user?.photoURL}
                        />
                      ))}
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-between md:m-3 m-1">
              <Input
                className="mr-3"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    sendMessage();
                  }
                }}
                disabled={isSending}
              />
              <Button
                disabled={isSending}
                onClick={sendMessage}
                className="w-[80px]"
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Send"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-2 lg:col-span-1 flex flex-col h-full justify-center items-center w-full">
        <div className="w-full max-w-[400px]">
          <div>
            <Label htmlFor="name">Title :</Label>
            <Input
              id="email"
              value={title}
              className="w-full mt-2"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>

          <div className="mt-8">
            <Label>Image :</Label>
            <div className="flex flex-col w-full h-[250px]">
              <ImageInput
                image={image}
                onImageChange={handleImageChange}
                disabled={isUpdating}
              />
            </div>
          </div>

          <div className="mt-12 flex items-center gap-3 justify-center">
            <Button
              disabled={isUpdating}
              variant="outline"
              onClick={handleUpdate}
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
            <Button
              disabled={isUpdating}
              variant="outline"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default ChatClient;
