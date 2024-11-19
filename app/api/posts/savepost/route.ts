import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  // Changed to POST
  const userId = req.nextUrl.searchParams.get("userId");
  const postId = req.nextUrl.searchParams.get("postId");
  const isAlreadySaved = req.nextUrl.searchParams.get("isAlreadySaved");

  if (!userId || !postId) {
    return NextResponse.json(
      { message: "No such post or user exists" },
      { status: 401 }
    );
  }

  try {
    await db.user.update({
      where: { id: parseInt(userId) },
      data: {
        savedPosts:
          isAlreadySaved === "true"
            ? {
                disconnect: { id: parseInt(postId) }, // If saved, remove
              }
            : {
                connect: { id: parseInt(postId) }, // If not saved, add
              },
      },
    });

    return NextResponse.json(
      {
        SavedPost: isAlreadySaved === "true" ? false : true,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log("Error", err);
    return NextResponse.json({ message: "Error connecting!" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId") as string;
  const postId = req.nextUrl.searchParams.get("postId") as string;

  try {
    const user = await db.user.findUnique({
      where: { id: Number(userId) },
      select: {
        savedPosts: {
          where: { id: Number(postId) },
        },
      },
    });
    if (!user) {
      throw new Error("Couldn't find user");
    }
    // console.log("Get Saved Posts", user);
    if (user?.savedPosts?.length > 0) {
      return NextResponse.json({ SavedPost: true }, { status: 200 });
    } else {
      return NextResponse.json({ SavedPost: false }, { status: 200 });
    }
  } catch (err) {
    console.log("Error getting saved status", err);
  }
}
