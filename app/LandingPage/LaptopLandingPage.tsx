import { Button } from "@/components/ui/button";
import { TextGenerateEffect } from "@/components/ui/textGenerator";
import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";
import { Dancing_Script } from "next/font/google";
import { cn } from "@/lib/utils";

const dancingScript = Dancing_Script({ subsets: ["latin"] });

const LaptopLandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      {/* header */}
      <div className="flex justify-start w-full container">
        <Image
          src={"/logo.svg"}
          width={36}
          height={36}
          className="size-12"
          alt="logo"
        />
        <h1
          className={cn("text-4xl text-blue-600 ml-2", dancingScript.className)}
        >
          ChitChat
        </h1>
      </div>
      {/* Hero Section */}
      <div className="text-center mb-8 flex">
        <div className="mt-32">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to <span className="text-blue-500">ChitChat</span>
          </h1>
          <TextGenerateEffect
            words=" Join us today to experience seamless communication and stay connected with friends and colleagues."
            className="max-w-[80%] mx-auto mt-16 leading-loose"
          />
        </div>

        <Image
          src={"/Work chat-cuate.svg"}
          width={54}
          height={54}
          className={" size-1/3 mx-auto"}
          alt="chat"
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

export default LaptopLandingPage;
