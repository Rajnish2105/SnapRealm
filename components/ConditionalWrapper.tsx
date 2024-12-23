'use client';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { HomeSidebar } from './HomeSidebar';

export default function ConditionalWrapper({
  children,
  username,
  image,
}: {
  username: string;
  image: string | null;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const noLayoutRoutes = ['/signin', '/signup'];

  if (noLayoutRoutes.includes(pathname) || pathname.startsWith('/stories')) {
    return <>{children}</>;
  }

  return (
    <main>
      <HomeSidebar username={username} image={image}>
        {children}
      </HomeSidebar>
    </main>
  );
}
