"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { IconType } from "react-icons";

interface ISidebarLink {
  href?: string;
  selected?: boolean;
  icon?: IconType;
  label: string;
  className?: string;
  onClick?: () => void;
}

const SidebarLink: React.FC<ISidebarLink> = ({
  onClick,
  href,
  selected = false,
  icon: Icon,
  label,
  className,
}) => {
  const router = useRouter();

  const clickHandler = () => {
    href && router.push(href);
    onClick && onClick();
  };
  return (
    <div
      onClick={clickHandler}
      className={clsx(
        `cursor-pointer p-1 px-2 hover:bg-zinc-100 transition-all flex items-center text-zinc-700 hover:text-black rounded-sm m-1 ${
          selected
            ? "bg-zinc-200/80 text-black font-semibold"
            : "bg-white text-zinc-700"
        }`,
        className
      )}
    >
      {Icon && <Icon size={20} />}
      <span className="ml-3">{label}</span>
    </div>
  );
};

export default SidebarLink;
