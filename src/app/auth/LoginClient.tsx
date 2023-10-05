"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";
import { useForm, SubmitHandler } from "react-hook-form";
import { firestore } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import useAdmin from "@/hooks/state-management/useAdmin";
import toast, { Toaster } from "react-hot-toast";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface IFormInput {
  email: string;
  password: string;
}

interface ILoginClient {}

const LoginClient: React.FC<ILoginClient> = ({}) => {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const adminStore = useAdmin();
  const router = useRouter();

  const submitHandler: SubmitHandler<IFormInput> = (data) => {
    setLoading(true);

    const encryptedPassword = bcrypt.hashSync(
      data.password,
      "$2a$10$CwTycUXWue0Thq9StjUM0u"
    );

    getDocs(collection(firestore, "admins"))
      .then((snapshot) => {
        const _admin = snapshot.docs.find(
          (_doc) => _doc.data().email == data.email
        );

        if (_admin) {
          if (_admin.data().password == encryptedPassword) {
            adminStore.setAdmin(
              { id: _admin.id, email: _admin.data().email },
              false
            );
            setAuthError("");
            router.push("/");
          } else {
            toast.error("Invalid credentials");
          }
        } else {
          toast.error("You are not registered as Admin.");
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center">
      <div className="flex flex-col bg-white rounded-lg border border-zinc-300 p-10">
        <div className="grid grid-rows-2 gap-1">
          <h1 className="text-3xl font-bold text-center">Andiamo</h1>
          <span className="text-md font-medium text-center text-zinc-300">
            Admin Site
          </span>
        </div>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="my-8 grid grid-rows-2 gap-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="name">Email :</Label>
              <Input
                id="email"
                {...register("email", {
                  required: true,
                  pattern: /^\S+@\S+$/i,
                })}
              />
              {errors.email?.type == "required" && (
                <span className="text-xs text-rose-500">Email is required</span>
              )}
              {errors.email?.type == "pattern" && (
                <span className="text-xs text-rose-500">
                  Enter a valid email
                </span>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="name">Password :</Label>
              <Input
                id="password"
                type="password"
                {...register("password", { required: true })}
              />
              {errors.password?.type == "required" && (
                <span className="text-xs text-rose-500">
                  Password is required
                </span>
              )}
            </div>
          </div>
          <Button disabled={loading} type="submit" className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Login"}
          </Button>
        </form>
      </div>
      <Toaster />
    </div>
  );
};

export default LoginClient;
