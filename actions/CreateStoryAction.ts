'use server';

import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { uploadImages } from '@/lib/cloudinary';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';

export async function CreateStory(formData: FormData) {
  const session = await getServerSession(authOptions);
  const userid = session?.user?.id as unknown as number;
  const stories = formData.getAll('media') as File[];

  let errors = { userid: '', stories: '' };

  if (!userid) {
    errors.userid = 'Not authorised';
  }
  if (!stories) {
    errors.stories = 'No stories to post';
  }

  const storiesUrl = await uploadImages(stories);

  try {
    const newstories = db.story.create({
      data: {
        stories: storiesUrl,
        userId: userid,
      },
    });

    return { newstories, message: 'Stories posted successfully' };
  } catch (err) {
    return { errors, message: 'Error creating stories' };
  }
}
