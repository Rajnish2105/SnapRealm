"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

type UserType = {
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
  const [allUsers, setAllUsers] = useState<UserType[]>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filtered, setFiltered] = useState<UserType[] | null>();

  useEffect(() => {
    async function getAllUsers() {
      const res = await fetch("/api/user/find");
      if (!res.ok) {
        toast.error("Couldn't get users");
      }
      const { allUsers } = await res.json();
      setAllUsers(allUsers);
    }
    getAllUsers();
  }, []);

  useEffect(() => {
    if (searchTerm !== "") {
      const filteredUsers = allUsers?.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFiltered(filteredUsers);
    } else {
      setFiltered([]);
    }
  }, [searchTerm, allUsers]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  return (
    <dialog open={status} onClose={changeStatus} className="bg-transparent">
      <div className="fixed inset-0 bg-black/50 z-10" onClick={changeStatus} />
      <div className="fixed top-0 left-0 w-full xl:w-[350px] bg-[rgba(0,0,0,0.9)] h-screen z-30 shadow-lg overflow-hidden flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Search</h2>
            <button
              onClick={changeStatus}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-4 w-4" />
            <Input
              type="text"
              className="pl-10 w-full"
              placeholder="Search"
              value={searchTerm}
              onChange={handleChange}
            />
          </div>
        </div>
        <ScrollArea className="flex-grow">
          <ul className="p-2">
            {filtered && filtered.length > 0 ? (
              filtered.map((user) => (
                <li key={user.username} className="py-2">
                  <Link
                    href={`/${user.username}`}
                    className="flex items-center space-x-3 text-white hover:text-black hover:bg-gray-100 p-2 rounded-md"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={
                          user.image ||
                          `https://api.multiavatar.com/${user.username}.svg`
                        }
                        alt={`${user.name}'s avatar`}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{user.username}</p>
                      <p className="text-sm text-gray-500">{user.name}</p>
                    </div>
                  </Link>
                </li>
              ))
            ) : searchTerm !== "" ? (
              <li className="py-2 text-center text-gray-500">No users found</li>
            ) : null}
          </ul>
        </ScrollArea>
      </div>
    </dialog>
  );
}
