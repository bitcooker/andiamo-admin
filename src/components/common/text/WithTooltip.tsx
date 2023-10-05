"use client";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface IWithTooltip {
  tooltip: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const WithTooltip: React.FC<IWithTooltip> = ({
  children,
  tooltip,
  onClick,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger onClick={onClick}>{children}</TooltipTrigger>
        <TooltipContent className="bg-black/80">
          <p className="text-white hover:font-bold">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default WithTooltip;
