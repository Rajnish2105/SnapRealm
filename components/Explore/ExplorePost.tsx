'use client';

type Post = {
  id: number;
  title: string;
  description: string | null;
  media: string[];
  createdAt: Date;
  updatedAt: Date;
  authorId: number;
  likedby: Likedby[];
};

type Likedby = {
  userId: number;
  postId: number;
};

import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import CustomLoader from '../CustomLoader';

export default function ExplorePost() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loader, setLoader] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredPost, setHoveredPost] = useState<number | null>(null);

  const fetchPosts = async () => {
    setLoader(true);
    try {
      // console.log(`Fetching page ${page}`);
      const res = await fetch(`/api/explore?page=${page}&limit=${7}`);
      if (!res.ok) {
        throw new Error("Can't get your posts");
      }
      const data = await res.json();

      if (data.posts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...data.posts]); // Append new posts
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoader(false);
    }
  };

  const handleInfiniteScroll = () => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 1 && hasMore && !loader) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleInfiniteScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleInfiniteScroll);
      }
    };
  }, [hasMore, loader]);

  return (
    <div
      ref={containerRef}
      className=" w-full overflow-auto [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
      style={{ height: '100vh' }} // Ensure the container is scrollable
    >
      <div className="w-full md:w-[80%] mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-4">
          {posts.map((post) => (
            <Link
              href={`/post/${post.id}`}
              key={post.id}
              className="relative aspect-square overflow-hidden"
              onMouseEnter={() => setHoveredPost(post.id)}
              onMouseLeave={() => setHoveredPost(null)}
            >
              <Image
                src={post.media[0]}
                alt={`Post ${post.id}`}
                fill
                style={{ objectFit: 'cover' }}
                className={`transition-transform duration-300 ease-in-out ${
                  hoveredPost === post.id ? 'scale-110' : 'scale-100'
                }`}
              />
              {hoveredPost === post.id && (
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <span className="sr-only">View post</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-8 h-8 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
      {loader && (
        <p className="w-full flex justify-center">
          <CustomLoader />
        </p>
      )}
      {!hasMore && (
        <p className="text-center w-full text-gray-500 my-4">Reached the end</p>
      )}
    </div>
  );
}
