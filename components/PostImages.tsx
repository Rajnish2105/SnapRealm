'use client';
import { motion } from 'framer-motion';
import React from 'react';
import { ImagesSlider } from './ui/images-slider';

export default function PostImages({ images }: { images: string[] }) {
  return (
    <ImagesSlider className="h-[30rem] w-full" images={images}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 1,
        }}
        className="z-50 flex flex-col justify-center items-center"
      ></motion.div>
    </ImagesSlider>
  );
}
