"use client";
import React, { useState, createContext, useContext } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { useNavigation } from "@/hooks/useNavigation";
import { UserButton } from "@clerk/nextjs";
import { Dancing_Script } from "next/font/google";
import Image from "next/image";
import { ThemeToggle } from "../theme/theme-toggle";

// Load the font
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
});

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

// SidebarProvider for managing state
export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Main Sidebar component
export const SidebarWrapper = ({ children }: { children: React.ReactNode }) => {
  const paths = useNavigation();
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "rounded-md flex flex-col bg-gray-100 md:flex-row w-scree dark:bg-neutral-800 flex-1 border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-full"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <div className="flex items-center gap-3">
              <LogoIcon />
              <Logo />
            </div>
            <div className="mt-8 flex flex-col gap-2">
              {paths.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  count={link?.count as number}
                  className={link.active ? "bg-blue-400 text-white" : ""}
                  onClick={() => setOpen(false)}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center w-full justify-evenly">
            <UserButton />
            <ThemeToggle />
          </div>
        </SidebarBody>
      </Sidebar>
      {children}
    </div>
  );
};

// Logo component
export const Logo = () => {
  return (
    <Link href="/">
      <h3 className={` text-3xl text-blue-500 ${dancingScript.className}`}>
        ChitChat
      </h3>
    </Link>
  );
};

// LogoIcon component
export const LogoIcon = () => {
  return (
    <Link href="/">
      <Image src={"/logo.svg"} height={32} width={32} alt="logo" />
    </Link>
  );
};
