"use client";

import { useState } from "react";

export default function chatPage() {
  const [showInbox, setShowInbox] = useState(true);

  function handleChat(value: string) {
    if (value === "inbox") {
      setShowInbox(true);
    } else {
      setShowInbox(false);
    }
  }

  return (
    <main className="w-full h-screen flex">
      <div className="w-[350px] h-full flex flex-col border border-r-slate-200">
        <div className="w-full flex justify-evenly my-6 border-b-2 boder-b-white text-white">
          <p
            className={`${
              showInbox && "text-blue-500 border-b-2 border-b-blue-500"
            } hover:border-b-2 hover:border-b-white cursor-pointer`}
            onClick={() => handleChat("inbox")}
          >
            Inbox
          </p>
          <p
            className={`${
              !showInbox && "text-blue-500 border-b-2 border-b-blue-500"
            } hover:border-b-2 hover:border-b-white cursor-pointer`}
            onClick={() => handleChat("request")}
          >
            Request
          </p>
        </div>
        <div className="w-full text-center">
          {showInbox ? <div></div> : "request box"}
        </div>
      </div>

      <div className="flex-grow h-full flex"></div>
    </main>
  );
}
