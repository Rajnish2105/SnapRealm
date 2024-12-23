import { db } from '@/lib/db';
import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import * as z from 'zod';

//schema for validation
const userSchema = z.object({
  name: z.string(),
  username: z.string().min(3, { message: 'Username is too short' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 Characters long' }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, username, password } = userSchema.parse(body);

    //for email
    const existingUserEmail = await db.user.findUnique({
      where: { email: email },
    });
    if (existingUserEmail) {
      return NextResponse.json(
        { user: null, message: 'User with this email already exits' },
        { status: 409 }
      );
    }
    //for username
    const existingUsername = await db.user.findUnique({
      where: {
        username: username as string,
      },
    });
    if (existingUsername) {
      return NextResponse.json(
        { user: null, message: 'User with this username already exits' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // console.log("hashedpassword", hashedPassword);

    await db.user.create({
      data: {
        provider: 'credentials',
        name,
        username,
        email,
        password: hashedPassword,
      },
    });

    revalidatePath('/explore/people');
    return NextResponse.json(
      { message: 'New User created successfully' },
      { status: 201 }
    );
  } catch (err) {
    console.log('Error', err);
    return NextResponse.json(
      { message: 'Something went Wrong!!' },
      { status: 500 }
    );
  }
}
