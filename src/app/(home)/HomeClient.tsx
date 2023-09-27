"use client";
import React from "react";
import useAdmin from "@/hooks/state-management/useAdmin";
import { useRouter } from "next/navigation";

interface IHomeClient {}

const HomeClient: React.FC<IHomeClient> = ({}) => {
  const router = useRouter();
  const adminStore = useAdmin();

  if (!adminStore.admin) {
    router.push("/auth");
  } else {
    router.push("/dashboard");
  }

  return <div></div>;
};

export default HomeClient;
