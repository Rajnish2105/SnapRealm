import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  const postId = req.nextUrl.searchParams.get("postId");

  // console.log("User", userId);
  // console.log("Post", postId);

  if (!userId || !postId) {
    return NextResponse.json(
      { message: "Please login first" },
      { status: 401 }
    );
  }

  const content = await req.json();

  try {
    const newComment = await db.comment.create({
      data: {
        postId: parseInt(postId),
        authorId: parseInt(userId),
        content: content as string,
      },
    });

    if (newComment) {
      // console.log("Now the revalidation is going to happen");
      revalidatePath(`/post/${postId}`);
      return NextResponse.json(
        { message: "Create new Comment" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Error creating new Comment" },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error("Error creating the comment", err);
    return NextResponse.json(
      { message: "Error connecting to database" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get("postId") as string;

  try {
    const comments = await db.comment.findMany({
      where: {
        postId: parseInt(postId),
      },
      include: {
        author: true, // If you want to include the author of each comment
      },
    });

    if (comments.length === 0) {
      return NextResponse.json({ comments: [] }, { status: 200 });
    }
    return NextResponse.json({ comments: comments }, { status: 200 });
  } catch (err) {
    console.log("Error", err);
    return NextResponse.json(
      { message: "Not able  to get comments at the moment" },
      { status: 500 }
    );
  }
}
