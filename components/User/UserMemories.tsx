"use client";

import { IconBookmark, IconGrid4x4 } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
export default function UserMemories({
  allposts,
  savedposts,
  userid,
}: {
  userid: number;
  allposts: { id: number; media: string[] }[];
  savedposts: { id: number; media: string[] }[];
}) {
  const session = useSession();
  const [show, setShow] = useState<string>("posts");

  return (
    <div className="w-full flex flex-col items-center">
      <NavBar
        userid={userid}
        sessionid={parseInt(session.data?.user?.id!)}
        show={show}
        setShow={setShow}
      />
      {show === "posts" ? (
        allposts.length !== 0 ? (
          <>
            <WantToSee value={allposts} />
            <p className="w-full text-center text-[rgba(255,255,255,0.5)] my-4">
              Reached the End of the memories
            </p>
          </>
        ) : (
          <Empty what="Make" />
        )
      ) : savedposts.length !== 0 ? (
        <>
          <WantToSee value={savedposts} />
          <p className="w-full text-center text-[rgba(255,255,255,0.5)] my-4">
            No more saved memories
          </p>
        </>
      ) : (
        <Empty what="Save" />
      )}
    </div>
  );
}

function WantToSee({ value }: { value: { id: number; media: string[] }[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,_minmax(320px,_1fr))] w-full justify-items-center gap-x-3 gap-y-4">
      {value.map((post, i) => {
        return (
          <Link className="w-full" key={i} href={`/post/${post.id}`}>
            <div
              className={"h-[250px] bg-cover bg-center"}
              style={{ backgroundImage: `url(${post.media[0]})` }}
            />
          </Link>
        );
      })}
    </div>
  );
}

function Empty({ what }: { what: string }) {
  return (
    <div className="w-full m-auto mt-20 text-center text-[rgba(255,255,255,0.5)]">
      No Memories Yet..
      <Link className="text-blue-400" href="/post">
        {" "}
        {what} New Memories
      </Link>
    </div>
  );
}

function NavBar({
  userid,
  sessionid,
  show,
  setShow,
}: {
  userid: number;
  sessionid: number;
  show: string;
  setShow: Function;
}) {
  return (
    <ul className="flex w-full justify-center flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
      <li className="me-2" onClick={() => setShow("posts")}>
        <p
          className={`${
            show === "posts" && "dark:border-blue-600 dark:text-blue-500"
          } inline-flex items-center justify-center p-4 border-t-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group cursor-pointer`}
        >
          <IconGrid4x4 size={15} />
          Memories
        </p>
      </li>
      {sessionid === userid && (
        <li className="me-2" onClick={() => setShow("saved")}>
          <p
            className={`${
              show === "saved" && "dark:border-blue-600 dark:text-blue-500"
            } inline-flex items-center justify-center p-4 border-t-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group cursor-pointer`}
          >
            <IconBookmark size={15} />
            Saved
          </p>
        </li>
      )}
    </ul>
  );
}
