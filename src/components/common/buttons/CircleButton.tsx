"use client";

import React from "react";
import clsx from "clsx";

interface ICircleButton {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const CircleButton: React.FC<ICircleButton> = ({
  children,
  className,
  onClick,
}) => {
  return (
    <div
      className={clsx(
        "cursor-pointer rounded-full hover:shadow-md p-1",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default CircleButton;
