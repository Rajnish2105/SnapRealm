import CustomLoader from "@/components/CustomLoader";
import PeoplePage from "@/components/PoplePage";
import { Suspense } from "react";

export default function AllPeoplePage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex justify-center items-center">
          <CustomLoader />
        </div>
      }
    >
      <PeoplePage />;
    </Suspense>
  );
}
