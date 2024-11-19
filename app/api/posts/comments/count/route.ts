import { db } from "@/lib/db";
import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get("postId") as string;

  if (!postId) {
    return NextResponse.json(
      { message: "No such post exsist" },
      { status: 400 }
    );
  }

  try {
    const num = await db.comment.count({
      where: {
        postId: parseInt(postId),
      },
    });

    // console.log("Number of post", num);

    if (num || num === 0) {
      return NextResponse.json({ num: num }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Server Down" }, { status: 500 });
    }
  } catch (err) {
    console.log("Error", err);
    return NextResponse.json(
      { message: "The request was intrupted" },
      { status: 500 }
    );
  }
}
