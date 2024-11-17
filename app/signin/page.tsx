import CustomLoader from "@/components/CustomLoader";
import SigninForm from "@/components/form/signin-form";
import { Suspense } from "react";

export default function SingupPage() {
  return (
    <main className="w-full mt-[7%]">
      <Suspense
        fallback={
          <div className="w-full h-full flex justify-center items-center">
            <CustomLoader />
          </div>
        }
      >
        <SigninForm />
      </Suspense>
    </main>
  );
}
