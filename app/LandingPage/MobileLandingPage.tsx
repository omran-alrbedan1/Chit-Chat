import React from "react";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import { TextGenerateEffect } from "@/components/ui/textGenerator";
import { Dancing_Script } from "next/font/google";
import { cn } from "@/lib/utils";

const dancingScript = Dancing_Script({ subsets: ["latin"] });

const MobileLandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to{" "}
          <span
            className={cn("text-blue-500 text-4xl", dancingScript.className)}
          >
            ChitChat
          </span>
        </h1>
        <Image
          src={"/Messages-pana.svg"}
          width={36}
          height={36}
          className={" size-72 mx-auto"}
          alt="chat"
        />
        <TextGenerateEffect
          words=" Join us today to experience seamless communication and stay connected with friends and colleagues."
          className="max-w-[80%] mx-auto"
        />
      </div>

      {/* Call to Action (Sign In Button) */}
      <div className="mt-8">
        <Button size="lg">
          <SignInButton />
        </Button>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-600">
        <p>© 2024 ChitChat. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MobileLandingPage;
