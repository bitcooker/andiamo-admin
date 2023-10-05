import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col h-screen w-full justify-center items-center">
      <div className="w-fit mx-auto m-5 text-yellow-500">
        <h1 className="text-4xl text-center font-bold w-fit">Andiamo</h1>
        <div className="w-full flex justify-between text-zinc-500">
          <span className="text-xs">{`Let's pack`}</span>
          <span className="text-xs">{`a trip for you`}</span>
        </div>
        <hr className="mt-2" />
      </div>
    </div>
  );
}
