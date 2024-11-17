import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const inboxId = req.nextUrl.searchParams.get("inboxId");

  if (!inboxId) {
    return NextResponse.json({ messsage: "unAuthorized" }, { status: 401 });
  }

  console.log("back id", inboxId);

  try {
    const Inbox = await db.inbox.findFirst({
      where: {
        id: inboxId,
      },
      include: {
        messages: {
          select: {
            senderId: true,
            content: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        sender: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
      },
    });
    return NextResponse.json({ Inbox }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Could't connect to the server" },
      { status: 500 }
    );
  }
}
