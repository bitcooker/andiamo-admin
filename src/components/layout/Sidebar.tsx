"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import SidebarLink from "../common/link/SidebarLink";
import { BiSolidDashboard } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { BsWechat } from "react-icons/bs";
import { GiMountainRoad } from "react-icons/gi";
import { RiArticleFill } from "react-icons/ri";
import useAppStore from "@/hooks/state-management/useApp";
import CircleButton from "../common/buttons/CircleButton";
import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineRssFeed } from "react-icons/md";

interface ISidebar {}

const Sidebar: React.FC<ISidebar> = ({}) => {
  const pathname = usePathname();
  const appStore = useAppStore();

  const handleHideSidebar = () => {
    appStore.setShowSidebar(false);
  };
  return (
    <div
      className={`min-h-screen h-screen flex flex-col flex-grow-0 p-2 md:p-0 overflow-clip fixed z-50 md:relative transition-all ${
        appStore.showSidebar
          ? "translate-x-0  opacity-100 w-[300px] md:w-[300px] md:min-w-[300px]"
          : "-translate-x-[100%] opacity-0 w-0 md:min-w-[0px]"
      }`}
    >
      <div className="h-screen md:bg-zinc-100 md:p-2 md:fixed w-full">
        <div className="flex justify-between flex-col h-full rounded-md bg-white shadow-[0_3px_10px_rgb(0,0,0,0.05)]">
          <div className="flex flex-col h-full">
            <Logo />
            <div className="mt-5">
              <SidebarLink
                label="Dashboard"
                icon={BiSolidDashboard}
                selected={pathname == "/dashboard"}
                href="/dashboard"
                className="py-3"
              />
              <SidebarLink
                label="Users"
                icon={FaUsers}
                href="/dashboard/users"
                selected={pathname.includes("users")}
                className="py-3"
              />
              <SidebarLink
                label="Chats"
                icon={BsWechat}
                href="/dashboard/chats"
                selected={pathname.includes("chats")}
                className="py-3"
              />
              <SidebarLink
                label="Trips"
                icon={GiMountainRoad}
                href="/dashboard/trips"
                selected={pathname.includes("trips")}
                className="py-3"
              />
              <SidebarLink
                label="Feeds"
                icon={MdOutlineRssFeed}
                href="/dashboard/feeds"
                selected={pathname.includes("feeds")}
                className="py-3"
              />
            </div>
          </div>

          <div className="w-full">
            <div className="h-[1px] bg-zinc-200 mx-3"></div>
            <div className="w-full flex justify-end">
              <CircleButton className="w-fit m-4" onClick={handleHideSidebar}>
                <IoIosArrowBack size={20} />
              </CircleButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <div className="w-fit mx-auto m-5 text-yellow-500">
      <Link href="/dashboard">
        <h1 className="text-4xl text-center font-bold w-fit">Andiamo</h1>
      </Link>
      <div className="w-full flex justify-between text-zinc-500">
        <span className="text-xs">{`Let's pack`}</span>
        <span className="text-xs">{`a trip for you`}</span>
      </div>
      <hr className="mt-2" />
    </div>
  );
};

export default Sidebar;
