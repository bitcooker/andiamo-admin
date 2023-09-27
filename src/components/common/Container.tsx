import React from "react";

interface IContainer {
  children: React.ReactNode;
  isWide?: boolean;
}

const Container: React.FC<IContainer> = ({ children, isWide = false }) => {
  return (
    <div
      className={`${
        isWide ? "max-w-[2520px]" : "max-w-[1366px]"
      } mx-auto xl:px-20 md:px-10 sm:px-2 px-4`}
    >
      {children}
    </div>
  );
};

export default Container;
