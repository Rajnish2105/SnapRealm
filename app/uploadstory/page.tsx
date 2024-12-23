'use client';
import {
  IconFocusCentered,
  IconSend,
  IconTrash,
  IconUpload,
} from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';

export default function UploadStory() {
  const router = useRouter();
  const pathname = usePathname();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCameraReady, setIsCameraReady] = useState<boolean>(true);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const session = useSession();

  if (!session.data?.user) {
    router.push('/signup');
  }

  // Function to open the camera
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true, // Request video input
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current!.play().catch((error) => {
            console.error('Video play error:', error);
          });
          setIsCameraReady(true);
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  // Function to stop the camera
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      console.log('Camera stopped');
    }
  };

  // Open camera on mount, stop on unmount or route change
  useEffect(() => {
    if (!capturedPhoto) {
      openCamera();
    }

    const stopCameraOnRouteChange = () => {
      stopCamera();
    };

    // Listen to pathname changes
    if (pathname) {
      stopCameraOnRouteChange();
    }

    // Cleanup on unmount or route change
    return () => {
      stopCamera();
    };
  }, [capturedPhoto, pathname]);

  // Capture photo function
  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;

      context!.scale(-1, 1); // Flip horizontally
      context!.drawImage(
        videoRef.current,
        -videoRef.current.videoWidth, // Flip image
        0
      );

      const dataUrl = canvasRef.current.toDataURL('image/png');
      setCapturedPhoto(dataUrl);

      stopCamera();
      setIsCameraReady(false);
    }
  };

  // Handle file change (uploading image)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCapturedPhoto(reader.result);

          stopCamera();
          setIsCameraReady(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Discard the captured photo and restart the camera
  const discardPhoto = () => {
    setCapturedPhoto(null);
    setIsCameraReady(true);
    openCamera(); // Restart the camera
  };

  // Upload story function
  async function uploadStory() {
    if (capturedPhoto) {
      const formData = new FormData();
      const response = await fetch(capturedPhoto);
      const blob = await response.blob();
      formData.append('image', blob, 'captured-image.png');

      try {
        const res = await fetch('/api/user/stories', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          console.log('Image uploaded successfully');
        } else {
          console.error('Image upload failed');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error("Couldn't upload your image right!", { closeButton: true });
      } finally {
        router.push('/'); // Redirect after upload
      }
    }
  }

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center">
      <h1 className="absolute top-4 text-xl font-bold">Upload Your Story</h1>

      {/* Camera View or Photo Preview */}
      {!capturedPhoto && isCameraReady && (
        <div className="w-[90%] md:w-[600px] h-[80%] bg-black rounded-md overflow-hidden">
          <video
            ref={videoRef}
            className="object-cover w-full h-full transform scale-x-[-1]"
            autoPlay
            playsInline
          />
        </div>
      )}

      {/* Captured Photo Preview */}
      {capturedPhoto && (
        <Image
          src={capturedPhoto}
          alt="Captured"
          width={600}
          height={700}
          className="w-[90%] md:w-[600px] h-[80%] object-cover rounded-md"
        />
      )}

      {/* Canvas (hidden) */}
      <canvas ref={canvasRef} className="hidden"></canvas>

      {/* Buttons */}
      <div className="absolute bottom-2 flex items-center justify-center w-full">
        {!capturedPhoto && (
          <>
            <button
              onClick={capturePhoto}
              className="border-2 rounded-full p-2 mx-56"
            >
              <IconFocusCentered size={40} />
            </button>
            <label className="p-2 border-2 rounded-full flex items-center justify-center shadow-md cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <IconUpload size={30} />
            </label>
          </>
        )}

        {capturedPhoto && (
          <>
            <button
              className="text-white px-6 py-3 rounded border-2 shadow-md mx-10 flex"
              onClick={uploadStory}
            >
              Post
              <IconSend />
            </button>
            <button
              onClick={discardPhoto}
              className="text-white px-6 py-3 rounded border-2 shadow-md flex"
            >
              Discard <IconTrash />
              zzzzzz
            </button>
          </>
        )}
      </div>
    </div>
  );
}
