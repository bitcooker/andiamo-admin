"use client";

import React, { useState, useEffect } from "react";

interface IClientOnly {
  children: React.ReactNode;
}

const ClientOnly: React.FC<IClientOnly> = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return <>{children}</>;
};

export default ClientOnly;
