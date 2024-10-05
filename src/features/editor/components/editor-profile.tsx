import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";

export const EditorProfile = ({
  profile,
}: {
  profile: ProfileViewDetailed | null;
}) => {
  if (!profile) {
    return (
      <div className="flex gap-3 items-center">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 items-center">
      <Avatar className="hover:opacity-80 duration-200">
        <AvatarImage src={profile?.avatar} alt="user avatar" />
        <AvatarFallback>
          <Skeleton />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="font-bold">{profile?.displayName}</span>
        <span className="text-gray-500">@{profile?.handle}</span>
      </div>
    </div>
  );
};
