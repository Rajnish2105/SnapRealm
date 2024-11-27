"use client";

import { useState } from "react";
import { Copy, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconBrandFacebook, IconSend, IconMessage } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/button";

import { Facebook, Share2, Mail, Link } from "lucide-react";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import { toast } from "sonner";

export default function PostShare({ postid }: { postid: number }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleShare = () => setIsOpen(!isOpen);

  const shareOptions = [
    {
      name: "Facebook",
      icon: Facebook,
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            `http://localhost:3000/post/${postid}`
          )}`,
          "_blank"
        );
      },
    },
    {
      name: "Whatsapp",
      icon: IconBrandWhatsapp,
      action: () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
          `http://localhost:3000/post/${postid}`
        )}`;
        window.open(whatsappUrl, "_blank");
      },
    },
    {
      name: "Message",
      icon: IconMessage,
      action: () => console.log("in chat"),
    },
    {
      name: "Copy Link",
      icon: Link,
      action: () => {
        navigator.clipboard.writeText(`http://localhost:3000/post/${postid}`);
        toast.success("Link Copied", { closeButton: true });
      },
    },
  ];

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleShare}
        aria-label={isOpen ? "Close share options" : "Open share options"}
        aria-expanded={isOpen}
        className="relative z-30"
      >
        <Share2 className="h-8 w-8 z-30" />
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute -top-20 -left-20 w-40 h-40 z-20"
          >
            {shareOptions.map((option, index) => (
              <motion.div
                key={option.name}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  position: "absolute",
                  top: `${50 - 40 * Math.cos((index * 2 * Math.PI) / 5)}%`,
                  left: `${50 + 40 * Math.sin((index * 2 * Math.PI) / 5)}%`,
                }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={() => {
                    option.action();
                    toggleShare();
                  }}
                  aria-label={`Share via ${option.name}`}
                >
                  <option.icon className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
