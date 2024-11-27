"use client";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { HomeSidebar } from "./HomeSidebar";

export default function ConditionalWrapper({
  children,
  username,
  image,
  name,
}: {
  username: string;
  image: string;
  name: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const noLayoutRoutes = ["/signin", "/signup", "/stories"];

  if (noLayoutRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <main>
      <HomeSidebar username={username} image={image} name={name}>
        {children}
      </HomeSidebar>
    </main>
  );
}
