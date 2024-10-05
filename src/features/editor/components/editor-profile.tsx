import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";

export const EditorProfile = ({
  profile,
}: {
  profile: ProfileViewDetailed;
}) => {
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
