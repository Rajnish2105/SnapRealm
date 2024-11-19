"use client";

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
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import CustomLoader from "../CustomLoader";

export default function ExplorePost() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loader, setLoader] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
      console.error("Error fetching posts:", error);
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
      container.addEventListener("scroll", handleInfiniteScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleInfiniteScroll);
      }
    };
  }, [hasMore, loader]);

  return (
    <div
      ref={containerRef}
      className=" w-full overflow-auto"
      style={{ height: "100vh" }} // Ensure the container is scrollable
    >
      <div className="justify-items-center gap-x-2 gap-y-2 my-8 w-[70%] grid grid-cols-[repeat(auto-fit,_minmax(320px,_1fr))] m-auto">
        {posts.map((post) => (
          <Link href={`/post/${post.id}`} className="w-full" key={post.id}>
            <div
              className={"h-[250px] bg-cover bg-center"}
              style={{ backgroundImage: `url(${post.media[0]})` }}
            />
          </Link>
        ))}
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
