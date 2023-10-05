"use client";
import React from "react";
import useAdmin from "@/hooks/state-management/useAdmin";
import { useRouter } from "next/navigation";

interface IAuthenticated {
  children: React.ReactNode;
}

const Authenticated: React.FC<IAuthenticated> = ({ children }) => {
  const adminStore = useAdmin();
  const router = useRouter();

  if (!adminStore.admin) {
    router.push("/auth");
  }

  return children;
};

export default Authenticated;
