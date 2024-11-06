"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

import Link from "next/link";
import Image from "next/image";
import { IconX } from "@tabler/icons-react";

type usertype = {
  name: string;
  username: string;
  image: string;
  bio: string;
};

export default function SearchDialog({
  status,
  changeStatus,
}: {
  status: boolean;
  changeStatus: () => void;
}) {
  const [allUsers, setAllUsers] = useState<usertype[]>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filtered, setFiltered] = useState<usertype[] | null>();

  useEffect(() => {
    async function getAllusers() {
      const res = await fetch("/api/user/find");
      if (!res.ok) {
        toast.error("couldn't get users");
      }
      const { allUsers } = await res.json();
      setAllUsers(allUsers);
    }
    getAllusers();
  }, []);

  useEffect(() => {
    if (searchTerm !== "") {
      const filteredusers = allUsers?.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFiltered(filteredusers);
    } else {
      setFiltered([]);
    }
  }, [searchTerm]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  return (
    <dialog open={status} onClose={changeStatus}>
      <div className="fixed top-0 left-0 w-[20%] h-screen bg-[rgba(0,0,0,0.9)] z-30 p-5 rounded-sm text-white">
        <button className="absolute top-2 right-2" onClick={changeStatus}>
          <IconX />
        </button>
        <input
          type="text"
          className="border outline-none rounded-full w-full p-2 mb-2 bg-transparent"
          placeholder="search your partner.."
          value={searchTerm}
          onChange={handleChange}
        />
        <div className="h-1 bg-white w-full rounded-full mb-2" />

        <ul className="w-full h-full p-2 flex flex-col space-y-5">
          {filtered && filtered?.length !== 0 ? (
            filtered?.map((user) => {
              return (
                <li className="w-full my-2">
                  <Link href={`/${user.username}`}>
                    <div className="flex flex-grow items-center">
                      <div className="w-11 h-11 rounded-full mr-2 flex justify-center overflow-hidden">
                        <Image
                          src={
                            user.image
                              ? user.image
                              : `https://api.multiavatar.com/${user.username}.svg` ||
                                "./defaultuser.svg"
                          }
                          alt="user image"
                          width={45}
                          height={20}
                        />
                      </div>
                      <div className="text-xs flex flex-col justify-center">
                        <p>{user.username}</p>
                        <p className="text-[rgba(255,255,255,0.5)] pl-1">
                          {user.name}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })
          ) : (
            <div className="w-full h-full justify-center items-center"></div>
          )}
        </ul>
      </div>
    </dialog>
  );
}
