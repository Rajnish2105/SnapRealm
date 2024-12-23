import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ message: "UnAuthorized" }, { status: 401 });
  }

  try {
    const user = await db.user.findFirst({
      where: {
        id: Number(session.user.id),
      },
    });

    // console.log("user found", user);

    return NextResponse.json({ noti: user?.notification }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "couldn't get the server" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const changeTo = req.nextUrl.searchParams.get("changeTo");
  const target = req.nextUrl.searchParams.get("target");

  console.log("changeTo", changeTo);

  if (!changeTo || !target) {
    return NextResponse.json(
      { message: "Invalid value for 'changeTo'. Use 'true' or 'false'." },
      { status: 400 }
    );
  }

  try {
    const updateuser = await db.user.update({
      where: {
        username: target,
      },
      data: {
        notification: changeTo === "true",
      },
    });

    console.log("updated user", updateuser);

    revalidatePath("/", "layout");
    return NextResponse.json({ message: "sent successfully" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "couldn't get the server" },
      { status: 500 }
    );
  }
}
