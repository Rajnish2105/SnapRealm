'use client';

import { useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import ProfileEdit from './ProfileEdit';
import UserStories from './UserStories';
import Activities from './Activities';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type userStoriestype = {
  id: string;
  createdAt: Date;
  stories: string[];
};

export default function SettingsPage({
  username,
  email,
  name,
  image,
  bio,
  stories,
  comments,
  liked,
  id,
}: {
  id: number;
  comments: {
    content: string;
    postId: number;
  }[];
  liked: {
    postId: number;
    post: {
      title: string;
      media: string[];
      description: string | null;
    };
  }[];
  stories: userStoriestype;
  bio: string;
  email: string;
  name: string | null;
  image: string | null;
  username: string;
}) {
  const session = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('profile');

  if (!session.data?.user) {
    router.push('/signup');
  }

  if (Number(session.data?.user?.id) !== id) {
    router.push('/');
  }

  return (
    <div
      className="container mt-4 mx-auto p-4 min-h-screen overflow-y-auto [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
    >
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        {/* Left Sidebar */}
        <div className="space-y-6">
          {/* User Avatar and Details */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-50">
              <Image
                src={
                  image ||
                  `https://api.multiavatar.com/${username}.svg` ||
                  './defaultuser.svg'
                }
                alt="user image"
                height={90}
                width={95}
              />
            </Avatar>
            <Card className="w-full">
              <CardContent className="p-4 space-y-2">
                <h2 className="font-semibold">{username}</h2>
                <p className="text-sm text-muted-foreground">{email}</p>
                <p className="text-sm text-muted-foreground">{name}</p>
                <p className="text-sm text-muted-foreground">{bio}</p>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Tabs */}
          <div className="space-y-2">
            <Button
              variant={activeTab === 'profile' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('profile')}
            >
              Edit Profile
            </Button>
            <Button
              variant={activeTab === 'security' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('security')}
            >
              All Stories
            </Button>
            <Button
              variant={activeTab === 'notifications' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </Button>
            {/* <Button
              variant={activeTab === 'preferences' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('preferences')}
            >
              Activities
            </Button> */}
          </div>
        </div>

        {/* Right Content Area */}
        <Card>
          <CardContent className="p-6">
            {activeTab === 'profile' && (
              <ProfileEdit
                name={name}
                username={username}
                bio={bio}
                image={image}
              />
            )}
            {activeTab === 'security' && <UserStories stories={stories} />}
            {activeTab === 'notifications' && (
              <Activities comments={comments} liked={liked} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
