import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';
import CustomLoader from '@/components/CustomLoader';
import { Suspense } from 'react';
import User from '@/components/User/User';

export default async function UserPage({
  params,
}: {
  params: { username: string };
}) {
  const session = await getServerSession(authOptions);
  const { username } = params;

  if (!session?.user) {
    redirect('/');
  }

  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex justify-center items-center">
          <CustomLoader />
        </div>
      }
    >
      <main
        className="w-full h-full overflow-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
      >
        <User username={username} />
      </main>
    </Suspense>
  );
}
