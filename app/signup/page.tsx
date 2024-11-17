import CustomLoader from "@/components/CustomLoader";
import SignupForm from "@/components/form/signup-form";
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
        <SignupForm />
      </Suspense>
    </main>
  );
}
