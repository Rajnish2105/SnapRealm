import { v2 as cloudinary } from "cloudinary";

if (!process.env.CLOUDINARY_CLOUD_NAME) {
  throw new Error("CLOUDINARY_CLOUD_NAME is not set");
}

if (!process.env.CLOUDINARY_API_KEY) {
  throw new Error("CLOUDINARY_API_KEY is not set");
}

if (!process.env.CLOUDINARY_API_SECRET) {
  throw new Error("CLOUDINARY_API_SECRET is not set");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImages(media: File[]) {
  const uploadPromises = media.map(async (file) => {
    const imageData = await file.arrayBuffer();
    const mime = file.type;
    const encoding = "base64";
    const base64Data = Buffer.from(imageData).toString("base64");
    const fileUri = `data:${mime};${encoding},${base64Data}`;

    const result = await cloudinary.uploader.upload(fileUri, {
      folder: "nextjs-course-mutations",
    });

    return result.secure_url;
  });

  return Promise.all(uploadPromises);
}

type CloudinaryError = {
  message: string;
  http_code: number;
};

type CloudinaryResult = {
  result: string; // e.g., "deleted"
  id: string; // The ID of the deleted image
};

export async function deleteImages(media: string[]) {
  // Convert `cloudinary.uploader.destroy` to return a Promise
  const deleteImage = (id: string): Promise<void> =>
    new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(
        id,
        (error: CloudinaryError | null, result: CloudinaryResult | null) => {
          if (error) {
            console.error(`Error deleting image with id ${id}:`, error);
            reject(error);
          } else {
            console.log(`Image with id ${id} deleted successfully:`, result);
            resolve();
          }
        }
      );
    });

  // Use Promise.all to handle deletions in parallel
  try {
    await Promise.all(media.map((id) => deleteImage(id)));
    console.log("All images deleted successfully");
  } catch (error) {
    console.error("Error deleting one or more images:", error);
  }
}
