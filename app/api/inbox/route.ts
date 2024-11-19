import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(req: NextRequest) {
  const targetId = parseInt(req.nextUrl.searchParams.get("targetId") as string);
  const session = await getServerSession(authOptions);
  const userId = parseInt(session?.user?.id as string);

  if (!targetId || !userId) {
    return NextResponse.json({ message: "unAuthorized" }, { status: 401 });
  }

  let doesItExist = false;

  const existingInbox = await db.inbox.findFirst({
    where: {
      senderId: userId,
      receiverId: targetId,
    },
  });

  // console.log("Existing inbox where use is sender", existingInbox);

  const existinguserinbox = await db.inbox.findFirst({
    where: {
      senderId: targetId,
      receiverId: userId,
    },
  });

  // console.log("Existing inbox where use is reciver", existinguserinbox);

  if (existingInbox || existinguserinbox) doesItExist = true;

  // console.log("Existing inbox", existingInbox);

  try {
    if (!doesItExist) {
      const newInbox = await db.inbox.create({
        data: {
          senderId: userId,
          receiverId: targetId,
        },
      });

      console.log("the new inbox", newInbox);

      return NextResponse.json({ inbox: newInbox }, { status: 200 });
    } else {
      return NextResponse.json(
        { inbox: existingInbox || existinguserinbox },
        { status: 200 }
      );
    }
  } catch (err) {
    console.log("Error", err);
    return NextResponse.json({ message: "Server Down" }, { status: 500 });
  }
}
