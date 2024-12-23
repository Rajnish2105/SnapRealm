import NewPostForm from '@/components/customForm/NewPostForm';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import CustomLoader from '@/components/CustomLoader';

export default async function NewPostPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/signup');
  }

  return (
    <main className="flex justify-center items-center h-screen w-screen">
      <Suspense fallback={<CustomLoader />}>
        <NewPostForm />
      </Suspense>
    </main>
  );
}
