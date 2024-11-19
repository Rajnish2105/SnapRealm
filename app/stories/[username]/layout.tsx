import SnapRealm from "@/components/SnapRealm";
import { IconX } from "@tabler/icons-react";
import Link from "next/link";

export default function StoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full h-full flex justify-between relative">
      <Link className="absolute top-3 left-3 h-fit w-fit" href="/">
        <SnapRealm />
      </Link>
      {children}
      <Link className="absolute top-3 right-3 h-fit w-fit" href="/">
        <IconX size={25} />
      </Link>
    </main>
  );
}
