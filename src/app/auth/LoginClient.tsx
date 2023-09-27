"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";

interface IFormInput {
  email: string;
  password: string;
}

interface ILoginClient {}

const LoginClient: React.FC<ILoginClient> = ({}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const submitHandler: SubmitHandler<IFormInput> = (data) => {};

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
                {...register("password", { required: true })}
              />
              {errors.password?.type == "required" && (
                <span className="text-xs text-rose-500">
                  Password is required
                </span>
              )}
            </div>
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginClient;
