import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
  }

  const userId = parseInt(session.user.id as string);

  try {
    const userStory = await db.story.findFirst({
      where: {
        userId: userId,
      },
      include: {
        user: {
          select: {
            username: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ userStory }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Couldn't get user stories" },
      { status: 500 }
    );
  }
}
