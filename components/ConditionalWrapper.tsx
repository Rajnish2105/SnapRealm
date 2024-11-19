"use client";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { HomeSidebar } from "./HomeSidebar";

export default function ConditionalWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const noLayoutRoutes = ["/signin", "/signup", "/stories"];

  if (noLayoutRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <main>
      <HomeSidebar>{children}</HomeSidebar>
    </main>
  );
}
