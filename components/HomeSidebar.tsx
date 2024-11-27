"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
  IconArrowLeft,
  IconSearch,
  IconHome,
  IconCompass,
  IconSettings,
  IconVideo,
  IconPlus,
  IconBrandInstagram,
  IconMessage,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { useRecoilState } from "recoil";
import { isSearching } from "@/states/atom";
import SearchDialog from "./Search/SearchDialog";
import SnapRealm from "./SnapRealm";

export function HomeSidebar({
  children,
  username,
  image,
  name,
}: {
  children: React.ReactNode;
  username: string;
  name: string;
  image: string;
}) {
  // const { data: session } = useSession();
  const [searchStatus, setSearchStatus] = useRecoilState(isSearching);

  const links = [
    {
      label: "Home",
      href: "/",
      icon: (
        <IconHome className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Search",
      href: "#",
      icon: (
        <IconSearch className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      onClick: handleSearchSatus,
    },
    {
      label: "Explore",
      href: "/explore",
      icon: (
        <IconCompass className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "New Post",
      href: "/newpost",
      icon: (
        <IconPlus className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Reels",
      href: "/reels",
      icon: (
        <IconVideo className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Messages",
      href: "/chat",
      icon: (
        <IconMessage className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "/settings",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      onClick: async () => {
        await signOut();
      },
    },
  ];

  function handleSearchSatus() {
    console.log(searchStatus);
    setSearchStatus((prev) => !prev);
  }

  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row dark:bg-black w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      <SearchDialog status={searchStatus} changeStatus={handleSearchSatus} />
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: username as string,
                href: `/${username}`,
                icon: (
                  <Image
                    className="rounded-sm"
                    src={
                      image ||
                      `https://api.multiavatar.com/${name}.svg` ||
                      "./defaultuser.svg"
                    }
                    alt="user image"
                    height={20}
                    width={35}
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      {children}
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      {/* <IconBrandInstagram className="text-neutral-700 dark:text-neutral-200 h-8 w-8 flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Snap Realm
      </motion.span> */}
      <SnapRealm />
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <IconBrandInstagram className="text-neutral-700 dark:text-neutral-200 h-8 w-8 flex-shrink-0" />
    </Link>
  );
};

// Dummy dashboard component with content
// export const Dashboard = () => {
//   return (
//     <div className="flex flex-1">
//       <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
//         <div className="flex gap-2">
//           {[...new Array(4)].map((i) => (
//             <div
//               key={"first-array" + i}
//               className="h-20 w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse"
//             ></div>
//           ))}
//         </div>
//         <div className="flex gap-2 flex-1">
//           {[...new Array(2)].map((i) => (
//             <div
//               key={"second-array" + i}
//               className="h-full w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse"
//             ></div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };
