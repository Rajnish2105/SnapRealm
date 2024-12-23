import db from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('username');

  if (!username) {
    NextResponse.json({ message: 'UnAutherized' }, { status: 401 });
  }

  try {
    const userStories = await db.user.findUnique({
      where: {
        username: username as string,
      },
      select: {
        stories: true,
      },
    });

    const allStories = userStories?.stories || null;

    console.log('UserStories', userStories);

    return NextResponse.json(
      { allStories, message: 'success' },
      { status: 200 }
    );
  } catch (err) {
    console.log('Internal Server Error', err);
    return NextResponse.json({ message: 'Server Down' }, { status: 500 });
  }
}
