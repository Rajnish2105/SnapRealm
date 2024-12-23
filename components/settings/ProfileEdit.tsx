'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Upload } from 'lucide-react';
import { Label } from '../ui/label';
import { IconCheck, IconX } from '@tabler/icons-react';
import { toast } from 'sonner';
import { getSession } from 'next-auth/react';

export default function ProfileEdit({
  name,
  username,
  bio,
  image,
}: {
  name: string | null;
  username: string;
  bio: string;
  image: string | null;
}) {
  const [fileName, setFileName] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(image);
  const [userName, setUserName] = useState<string>(username);
  const [validUsername, setValidUsername] = useState<boolean | null>(null);
  const [ischecking, setIschecking] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    let debounceTimer: NodeJS.Timeout;

    if (userName) {
      if (userName.includes(' ') || userName.length <= 3) return;
      setIschecking(true);
      debounceTimer = setTimeout(async () => {
        const res = await fetch(`/api/user/usernamecheck?username=${userName}`);
        if (!res.ok) {
          console.log('Api down');
          return;
        }
        const { value } = await res.json();
        setValidUsername(value);
        setIschecking(false);
      }, 1000);
    } else {
      setValidUsername(false);
    }

    // Cleanup the timer on every userName change
    return () => {
      clearTimeout(debounceTimer);
      setIschecking(false); // Reset checking state
    };
  }, [userName]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Create FormData object to append form fields
    const formData = new FormData();

    // Append the user data
    formData.append('username', userName);
    formData.append('oldusername', username);
    formData.append('oldimage', image || 'null');
    formData.append(
      'name',
      (e.currentTarget.elements.namedItem('name') as HTMLInputElement).value
    );
    formData.append('bio', e.currentTarget.bio.value);

    // Append the image file (if any)
    if (fileName) {
      formData.append('newImage', fileName);
    }

    console.log('Profile updated:', {
      username: userName,
      oldusername: username,
      oldimage: image || 'null',
      name: (e.currentTarget.elements.namedItem('name') as HTMLInputElement)
        .value,
      bio: e.currentTarget.bio.value,
      newImage: fileName,
    });

    try {
      const res = await fetch('/api/user/usernamecheck', {
        method: 'PUT',
        body: formData, // Send FormData
      });

      if (!res.ok) {
        toast.error("Couldn't find the user", { closeButton: true });
      }

      const { message } = await res.json();
      toast.success(message, { closeButton: true });

      // Optionally refresh session after the update
      await fetch('/api/auth/session?update', {
        method: 'GET',
      });
      await getSession();
    } catch (err) {
      console.log('Error updating profile:', err);
      toast.error('Error updating profile, please try again later.', {
        closeButton: true,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold">Edit Profile</h2>
      <div className="space-y-4">
        <div className="gap-2 flex justify-between items-center">
          <div className="w-32 h-20 md:w-40 md:h-40 flex-shrink-0 overflow-hidden rounded-full">
            <Image
              src={previewUrl || `https://api.multiavatar.com/${username}.svg`}
              width={160}
              height={160}
              className="border border-gray-300 object-cover"
              alt={`${name}'s profile picture`}
              priority
            />
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Label
              htmlFor="profileImage"
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Upload className="w-5 h-5" />
              <span>Upload New Picture</span>
            </Label>
            <Input
              type="file"
              id="profileImage"
              name="profileImage"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {fileName ? fileName?.name : 'No file chosen'}
            </span>
          </div>
        </div>

        <div className="grid gap-2">
          <label htmlFor="username" className="text-sm font-medium flex">
            Username
            {ischecking ? (
              <div className="ml-3 w-5 h-5 border-[3px] border-t-gray-500 rounded-full animate-spin" />
            ) : validUsername ? (
              <IconCheck className="text-green-500" />
            ) : (
              <IconX className="text-red-700" />
            )}
          </label>
          <Input
            type="text"
            id="username"
            name="username"
            placeholder="Please don't put ' ' space in the username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          {userName.includes(' ') && (
            <span className="text-red-600">
              Please don&apos;t put &apos; &apos; in the username
            </span>
          )}
          {userName.length <= 3 && (
            <span className="text-red-600">
              Username must be at least 4 letters
            </span>
          )}
        </div>

        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm font-medium">
            Full Name
          </label>
          <Input type="text" id="name" name="name" defaultValue={name || ''} />
        </div>

        <div className="grid gap-2">
          <label htmlFor="bio" className="text-sm font-medium">
            Bio
          </label>
          <Input type="text" id="bio" name="bio" defaultValue={bio} />
        </div>

        <Button type="submit" className="w-full md:w-auto">
          Update Profile
        </Button>
      </div>
    </form>
  );
}
