"use client";

import React from "react";

interface IDashboardClient {}

const DashboardClient: React.FC<IDashboardClient> = ({}) => {
  return (
    <div>
      <h1 className="text-2xl">Dashboard</h1>
    </div>
  );
};

export default DashboardClient;
