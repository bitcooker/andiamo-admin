import React from "react";
import { BlocksWave } from "react-svg-spinners";

export default function Loading() {
  return (
    <div className="flex flex-col w-full h-full justify-center items-center">
      <BlocksWave width={50} height={50} color="#dbdbdb" />
    </div>
  );
}
