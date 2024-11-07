import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const user = await db.user.findFirst({
      where: {
        id: 19,
      },
    });
    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "no server" }, { status: 500 });
  }
}
