'use server';

import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import { uploadImages } from '@/lib/cloudinary';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function CreatePost(formData: FormData) {
  const session = await getServerSession(authOptions);
  const title = formData.get('title');
  const media = formData.getAll('media') as File[];
  const description = formData.get('description');

  const mediaUrls = await uploadImages(media);

  const newpost = await db.post.create({
    data: {
      media: mediaUrls,
      title: title as string,
      description: description as string,
      authorId: parseInt(session?.user?.id as string),
    },
  });
  if (newpost) {
    revalidatePath('/');
    redirect('/');
  } else {
    console.error('There is an error');
  }
}
