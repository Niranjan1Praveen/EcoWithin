"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ShinyButton } from "./ui/shiny-button";
import Link from "next/link";
import Image from "next/image";

const AppNavbar: React.FC = () => {
  return (
    <nav className="p-4 flex items-center justify-between z-10">
      {/* LEFT */}
      <SidebarTrigger />
      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* USER MENU */}

        <div className="flex space-x-3 items-center">
          <Link href="/">
            <ShinyButton className="bg-indigo-600 hover:bg-indigo-700 border-0 text-white">
              To Home Page
            </ShinyButton>
          </Link>
          <Image
            className="h-9 w-auto"
            src="/assets/logo-navbar.png"
            width={138}
            height={36}
            alt="logo"
          />
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;
