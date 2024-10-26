"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ConversationFallback from "../_components/ConversationFallback";

export default function Error({ error }: { error: Error }) {
  const router = useRouter();

  useEffect(() => {
    router.push("/conversations");
  }, [error, router]);

  return <ConversationFallback />;
}
