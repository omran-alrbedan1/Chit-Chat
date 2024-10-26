import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { MessageSquare, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const useNavigation = () => {
  const pathname = usePathname();
  const requestsCount = useQuery(api.requests.count);
  const conversations = useQuery(api.conversations.get);

  const unseenMessageCount = useMemo(() => {
    return conversations?.reduce((acc, curr) => {
      return acc + curr.unseenCount;
    }, 0);
  }, [conversations]);

  const paths = useMemo(
    () => [
      {
        href: "/conversations",
        label: "conversation",
        icon: <MessageSquare />,
        active: pathname.startsWith("/conversations"),
        count:unseenMessageCount
      },
      {
        href: "/friends",
        label: "friends",
        icon: <User />,
        active: pathname.startsWith("/friends"),
        count: requestsCount,
      },
    ],
    [pathname, requestsCount,unseenMessageCount]
  );
  return paths;
};
