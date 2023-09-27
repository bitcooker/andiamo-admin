"use client";
import React from "react";
import useAdmin from "@/hooks/state-management/useAdmin";

interface IAuthenticated {
  children: React.ReactNode;
}

const Authenticated: React.FC<IAuthenticated> = ({ children }) => {
  const adminStore = useAdmin();

  if (!adminStore.admin) {
    return;
  }

  return <>{children}</>;
};

export default Authenticated;
