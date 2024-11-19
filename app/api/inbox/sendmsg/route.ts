import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const inboxId = req.nextUrl.searchParams.get("inboxId");
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const body = await req.json();
  const { msg } = body;

  if (!inboxId || !userId || !msg) {
    return NextResponse.json({ message: "unAuthorized" }, { status: 200 });
  }

  try {
    await db.message.create({
      data: {
        senderId: Number(userId),
        conversationId: inboxId,
        content: msg,
      },
    });

    revalidatePath("/chat", "layout");
    return NextResponse.json(
      { message: "Message sent succesfully" },
      { status: 200 }
    );
  } catch (err) {
    console.log("Error", err);
    return NextResponse.json({ message: "Server Down" }, { status: 200 });
  }
}
