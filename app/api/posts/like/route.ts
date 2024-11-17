import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const postIdes = req.nextUrl.searchParams.get("postId") as string;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!postIdes) {
    return NextResponse.json(
      { message: "This Post doesn't exits" },
      { status: 400 }
    );
  }

  const userId = parseInt(session.user.id as string);
  const postId = parseInt(postIdes);

  // console.log(numberOfLikes);

  try {
    // Check if the user has already liked the post
    const existingLike = await db.likedby.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    console.log("Your status", existingLike);

    if (existingLike) {
      // If already liked, remove the like (unlike)
      const deletedLike = await db.likedby.delete({
        where: {
          userId_postId: { userId, postId },
        },
      });

      return NextResponse.json({ liked: false }, { status: 200 });
    } else {
      // If not liked, create a new like
      const doneliking = await db.likedby.create({
        data: {
          userId,
          postId,
        },
      });

      return NextResponse.json({ liked: true }, { status: 200 });
    }
  } catch (error) {
    console.log("server down");
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  const postId = req.nextUrl.searchParams.get("postId");

  if (!userId || !postId) {
    return NextResponse.json(
      { liked: false, error: "User ID and Post ID are required." },
      { status: 400 }
    );
  }

  try {
    const existingLike = await db.likedby.findFirst({
      where: {
        userId: parseInt(userId),
        postId: parseInt(postId),
      },
    });

    if (existingLike) {
      return NextResponse.json({ liked: true });
    } else {
      return NextResponse.json({ liked: false });
    }
  } catch (error) {
    console.error("Error fetching like status:", error);
    return NextResponse.json(
      { error: "Failed to fetch like status." },
      { status: 500 }
    );
  }
}
