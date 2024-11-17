import Link from "next/link";

export default function ReelsPage() {
  return (
    <div className="w-full h-full flex">
      <div className="w-[30%] my-auto flex flex-wrap justify-center items-center text-center">
        <span className="w-full text-9xl mb-4">404</span>
        <p className="w-full m-2">
          Oops... seems like you got lost in space...
        </p>
        <Link href="/" className="p-[3px] relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
          <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
            Go home
          </div>
        </Link>
      </div>
      <div className="w-[70%] h-full flex justify-center items-center">
        <div className="relative w-80 h-96 bg-white/10 backdrop-blur-md mx-auto rounded-lg shadow-2xl font-poppins before:absolute before:content-[''] before:-top-12 before:-right-12 before:w-32 before:h-32 before:bg-pink-500/50 before:-z-10 before:rounded-full before:blur-xl after:absolute after:content-[''] after:-bottom-12 after:-left-12 after:w-32 after:h-32 after:bg-purple-500/50 after:rounded-full after:blur-xl after:-z-10">
          <div className="w-full h-full flex justify-center items-center text-[rgba(255,255,255,0.5)] ">
            We are Working on this place
          </div>
        </div>
      </div>
    </div>
  );
}
