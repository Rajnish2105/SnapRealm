import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import { uploadImages } from "@/lib/cloudinary";

// export async function GET() {
//   const session = await getServerSession(authOptions);
//   const userId = parseInt(session?.user?.id as string);

//   if (!userId) {
//     return NextResponse.json({ message: "UnAuthorized" }, { status: 400 });
//   }

//   try {
//     // Step 1: Get the IDs of users you are following
//     const followingUsers = await db.follows.findMany({
//       where: {
//         followedById: userId, // Your user ID
//       },
//       select: {
//         followingId: true, // Get the following user's ID
//       },
//     });

//     // Step 2: Extract the following user IDs
//     const followingIds = followingUsers.map((follow) => follow.followingId);

//     // Step 3: Fetch the stories of the following users
//     const stories = await db.story.findMany({
//       where: {
//         userId: {
//           in: followingIds, // Use the following IDs to get their stories
//         },
//       },
//       include: {
//         user: {
//           select: {
//             username: true,
//             image: true, // Include user details if necessary
//           },
//         },
//       },
//     });

//     return NextResponse.json({ stories }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching following stories:", error);
//     return NextResponse.json(
//       { message: "Couldn't find you stories" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ message: "UnAuthorized" }, { status: 400 });
  }

  const formData = await req.formData(); // Parse form data
  const userId = parseInt(session.user.id as string);

  try {
    const files = formData.getAll("image") as File[];
    if (files.length === 0) {
      return NextResponse.json(
        { message: "No files uploaded" },
        { status: 400 }
      );
    }

    const storiesUrl = await uploadImages(files);
    const existingStory = await db.story.findFirst({
      where: { userId: userId },
    });

    // console.log("existing", existingStory);

    if (existingStory) {
      await db.story.update({
        where: {
          id: existingStory.id,
        },
        data: {
          stories: [...existingStory.stories, ...storiesUrl],
        },
      });

      return NextResponse.json({ message: "Story uploaded" }, { status: 200 });
    } else {
      await db.story.create({
        data: {
          stories: storiesUrl,
          userId: userId,
        },
      });
      return NextResponse.json(
        { message: "first story of today" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error creating stories:", error);
    return NextResponse.json(
      { message: "Error creating stories" },
      { status: 500 }
    );
  }
}
