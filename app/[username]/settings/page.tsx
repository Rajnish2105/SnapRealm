import { Metadata } from 'next';
import SettingsPage from '@/components/settings/Settingspage';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';
import db from '@/lib/db';
import CustomLoader from '@/components/CustomLoader';
import { toast } from 'sonner';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your account settings and preferences',
};

export default async function Settings({
  params,
}: {
  params: { username: string };
}) {
  const session = await getServerSession(authOptions);
  const { username } = params;
  // console.log('me', username);
  const user = await getUserInfo(username);
  // console.log('i am the user', user);
  if (!session?.user || !user) {
    redirect('/');
  }
  if (user) {
    return (
      <SettingsPage
        id={user.id}
        image={user.image as string}
        name={user.name as string}
        username={user.username as string}
        email={user.email as string}
        bio={user.bio || 'Tell something about yourself'}
        stories={user.stories[0]}
        comments={user.comments}
        liked={user.likes}
      />
    );
  }
  return (
    <div className="flex justify-center items-center h-full w-full">
      <CustomLoader />
    </div>
  );
}

async function getUserInfo(username: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        username: decodeURIComponent(username),
      },
      include: {
        stories: {
          select: {
            id: true,
            stories: true,
            createdAt: true,
          },
        },
        likes: {
          select: {
            postId: true,
            post: {
              select: {
                title: true,
                description: true,
                media: true,
              },
            },
          },
        },
        comments: {
          select: {
            postId: true,
            content: true,
          },
        },
      },
    });
    return user;
  } catch (err) {
    toast.error('my bad', { closeButton: true });
    console.log(err);
  }
}
