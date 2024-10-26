"use client";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import {
  Authenticated,
  AuthLoading,
  ConvexReactClient,
  Unauthenticated,
} from "convex/react";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
  useAuth,
  UserButton,
} from "@clerk/nextjs";
import LandingPage from "@/app/LandingPage";
import Loading from "@/components/Loading";

const convex = new ConvexReactClient(
  (process.env.NEXT_PUBLIC_CONVEX_URL as string) || ""
);

const ConvexClientProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <html lang="en">
          <body>
            <SignedOut>
              <LandingPage />
            </SignedOut>
            <AuthLoading>
              <Loading />
            </AuthLoading>

            {children}
          </body>
        </html>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
export default ConvexClientProvider;
