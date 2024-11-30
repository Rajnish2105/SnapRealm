"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGoogle, IconEye, IconEyeClosed } from "@tabler/icons-react";
import Link from "next/link";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import CustomLoader from "../CustomLoader";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 Characters long" }),
});

type FormData = z.infer<typeof schema>;

export default function SigninForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  function changeShowPassword() {
    setShowPassword((prev) => !prev);
  }

  const onSubmit = async (data: FormData) => {
    // console.log(data);
    setIsSubmitting(true);
    const response = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
      callbackUrl: "/",
    });
    // console.log(response);
    if (response?.ok) {
      setIsSubmitting(false);
      router.push("/");
    }
    if (response?.error) {
      toast.error("Password is wrong", {
        closeButton: true,
        duration: 10000,
        position: "bottom-center",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 pt-0 md:p-8,pt-0 shadow-input bg-white dark:bg-black">
      <div className="w-full flex justify-between items-center mb-4 ">
        <Link className="w-[50%]" href="/signup">
          <button className=" relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block w-full text-black dark:text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
            Sign up
            <BottomGradient />
          </button>
        </Link>
        <Link className="w-[50%]" href="/signin">
          <button className=" relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block w-full text-black dark:text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
            Sign in
            <BottomGradient />
          </button>
        </Link>
      </div>

      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 text-center">
        Let&apos;s dive in
      </h2>

      <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="your@gmail.com"
            {...register("email")}
            autoFocus
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </LabelInputContainer>
        <LabelInputContainer className="mb-4 relative">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="**********"
            {...register("password")}
            type={showPassword ? "text" : "password"}
          />
          {showPassword ? (
            <IconEye
              stroke={2}
              className="h-4 w-4 text-gray-500 absolute right-2 hover:bg-transparent top-7"
              onClick={changeShowPassword}
            />
          ) : (
            <IconEyeClosed
              stroke={2}
              className="h-4 w-4 text-gray-500 absolute right-2 hover:bg-transparent top-7"
              onClick={changeShowPassword}
            />
          )}
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="w-full h-full flex justify-center items-center">
              <CustomLoader />
            </div>
          ) : (
            "Sign in →"
          )}
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
          <button
            onClick={async () => {
              await signIn("google", {
                redirect: false,
                callbackUrl: "/",
              });
              router.push("/");
            }}
            className=" relative group/btn flex space-x-2 items-center justify-center px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="button"
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Google
            </span>
            <BottomGradient />
          </button>
        </div>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
