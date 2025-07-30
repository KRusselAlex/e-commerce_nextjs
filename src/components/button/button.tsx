"use client";

import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CustomButtonProps {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
  type?:"button" | "submit" | "reset" | undefined;
}

export default function CustomButton({
  children,
  icon,
  className,
  type="button"
}: CustomButtonProps) {
  return (
    <Button
      className={cn(
        "relative flex items-center overflow-hidden transition-all duration-300 group ",
        className
      )}
      type={type}
    >
      <span className="relative z-10 mt-1">{children}</span>

      <span className="ml-2 relative z-10 transition-transform duration-300 group-hover:translate-x-3">
        {icon}
      </span>
    </Button>
  );
}
