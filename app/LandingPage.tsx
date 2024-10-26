import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import React from "react";
import MobileLandingPage from "./LandingPage/MobileLandingPage";
import LaptopLandingPage from "./LandingPage/LaptopLandingPage";

const LandingPage = () => {
  return (
    <div className="h-full w-full">
      <div className="md:hidden">
        <MobileLandingPage />
      </div>
      <div className="hidden md:block">
        <LaptopLandingPage />
      </div>
    </div>
  );
};

export default LandingPage;
