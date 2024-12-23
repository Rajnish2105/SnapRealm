import { updateProfilePicture, uploadImage } from '@/lib/cloudinary';
import db from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('username');

  if (!username) {
    return NextResponse.json(
      { error: 'Username query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const user = await db.user.findUnique({
      where: {
        username: username,
      },
    });

    const result = !!user;

    return NextResponse.json({ value: !result }, { status: 200 });
  } catch (err) {
    console.log('Error checking username availability:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
export const runtime = 'nodejs';

export async function PUT(req: NextRequest) {
  try {
    const data = await req.formData();

    // Extract fields from the FormData
    const oldusername = data.get('oldusername') as string;
    const name = data.get('name') as string;
    const username = data.get('username') as string;
    const bio = data.get('bio') as string;
    const oldimage = data.get('oldimage') as string;
    const newImage = data.get('newImage') as File;

    console.log('oldusername', oldusername);
    console.log('oldimage', oldimage);
    console.log('newImage', newImage);

    let pfp: string | null;
    if (oldimage == 'null') {
      if (newImage) {
        pfp = await uploadImage(newImage);
      } else {
        pfp = null;
      }
    } else {
      if (newImage) {
        // If there is a new image, update the existing image
        pfp = await updateProfilePicture(newImage, oldimage);
      } else {
        pfp = oldimage;
      }
    }

    console.log('PFP', pfp);

    const updatedUser = await db.user.update({
      where: {
        username: oldusername,
      },
      data: {
        username: username,
        name: name,
        bio: bio,
        image: pfp,
      },
    });

    console.log('Updated user', updatedUser);

    if (updatedUser) {
      return NextResponse.json(
        { message: 'user updated succesfully' },
        { status: 200 }
      );
    } else {
      throw new Error('something did');
    }
  } catch (err) {
    console.log('Error updating user', err);
    return NextResponse.json({ message: 'Server down' }, { status: 500 });
  }
}
