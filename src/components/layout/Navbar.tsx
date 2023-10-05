"use client";

import React from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAdmin from "@/hooks/state-management/useAdmin";
import { useRouter } from "next/navigation";
import CircleButton from "../common/buttons/CircleButton";
import useAppStore from "@/hooks/state-management/useApp";
import { RiAppsFill } from "react-icons/ri";

interface INavbar {}

const Navbar: React.FC<INavbar> = ({}) => {
  const appStore = useAppStore();
  const handleShowSidebar = () => {
    appStore.setShowSidebar(true);
  };
  return (
    <div className="w-full p-3">
      <div className="w-full bg-white border border-zinc-200 p-1 rounded-lg flex items-center justify-between px-5">
        <div>
          {!appStore.showSidebar && (
            <CircleButton>
              <div
                className="w-5 h-5 flex items-center justify-center"
                onClick={handleShowSidebar}
              >
                <RiAppsFill />
              </div>
            </CircleButton>
          )}
        </div>
        <div className="flex items-center">
          <ProfileMenu />
        </div>
      </div>
    </div>
  );
};

const ProfileMenu = () => {
  const adminStore = useAdmin();
  const appStore = useAppStore();
  const router = useRouter();

  const handleSignOut = () => {
    adminStore.setAdmin(null, true);
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <CircleButton className="p-0">
          <Image
            alt="User Avatar"
            src="/images/user_avatar.jpg"
            width={35}
            height={35}
            className="rounded-full"
          />
        </CircleButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" alignOffset={5}>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Navbar;
