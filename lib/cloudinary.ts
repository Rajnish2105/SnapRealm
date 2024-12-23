import { v2 as cloudinary } from 'cloudinary';

if (!process.env.CLOUDINARY_CLOUD_NAME) {
  throw new Error('CLOUDINARY_CLOUD_NAME is not set');
}

if (!process.env.CLOUDINARY_API_KEY) {
  throw new Error('CLOUDINARY_API_KEY is not set');
}

if (!process.env.CLOUDINARY_API_SECRET) {
  throw new Error('CLOUDINARY_API_SECRET is not set');
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
    const encoding = 'base64';
    const base64Data = Buffer.from(imageData).toString('base64');
    const fileUri = `data:${mime};${encoding},${base64Data}`;

    const result = await cloudinary.uploader.upload(fileUri, {
      folder: 'nextjs-course-mutations',
    });

    return result.secure_url;
  });

  return Promise.all(uploadPromises);
}

// type CloudinaryError = {
//   message: string;
//   http_code: number;
// };

// type CloudinaryResult = {
//   result: string; // e.g., "deleted"
//   id: string; // The ID of the deleted image
// };

export async function deleteImages(media: string[]) {
  
  const extractPublicId = (url: string): string => {
    const parts = url.split('/');
    const publicIdWithExtension = parts.slice(-2).join('/');  return publicIdWithExtension.split('.')[0];
  };

  // Convert `cloudinary.uploader.destroy` to return a Promise
  const deleteImage = (id: string): Promise<void> =>
    new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(
        id,
        (
          error: cloudinary.UploadApiErrorResponse | null,
          result: cloudinary.UploadApiResponse | null
        ) => {
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

  try {
    // Extract public IDs from URLs and delete them
    const publicIds = media.map((url) => extractPublicId(url));
    await Promise.all(publicIds.map((id) => deleteImage(id)));
    console.log('All images deleted successfully');
  } catch (error) {
    console.error('Error deleting one or more images:', error);
  }
}

export async function uploadImage(file: File) {
  try {
    
    const imageData = await file.arrayBuffer();
    const mime = file.type;
    const encoding = 'base64';
    const base64Data = Buffer.from(imageData).toString('base64');

    // Construct the data URI for Cloudinary upload
    const fileUri = `data:${mime};${encoding},${base64Data}`;

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(fileUri, {
      folder: 'nextjs-course-mutations',
    });

    // Return the URL of the uploaded image
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Image upload failed');
  }
}


// Function to extract the public ID from a Cloudinary URL
const extractPublicId = (url: string): string => {
  const parts = url.split('/');
  const publicIdWithExtension = parts.slice(-2).join('/'); // Folder + filename
  return publicIdWithExtension.split('.')[0]; // Remove file extension
};

// Function to delete an image from Cloudinary
export async function deleteOldProfileImage(url: string) {
  try {
    const publicId = extractPublicId(url); // Extract the public ID from the URL
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`Deleted image with public ID "${publicId}":`, result);

    // Optional: Check if the deletion was successful
    if (result.result !== 'ok') {
      throw new Error(`Failed to delete image with public ID: ${publicId}`);
    }
  } catch (error) {
    console.error('Error deleting old profile image:', error);
    throw new Error('Image deletion failed');
  }
}


//combo of upload and delete
export async function updateProfilePicture(file: File, oldImageUrl: string | null) {
  try {
    // Step 1: Upload the new profile picture
    const newImageUrl = await uploadImage(file);

    // Step 2: Delete the old profile picture (if it exists)
    if (oldImageUrl) {
      await deleteOldProfileImage(oldImageUrl);
    }

    // Step 3: Return the new image URL (to update the database)
    return newImageUrl;
  } catch (error) {
    console.error('Error updating profile picture:', error);
    throw new Error('Profile picture update failed');
  }
}