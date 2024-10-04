import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export const AttachedContent = ({
  src,
  onClickRemove,
}: {
  src: string;
  onClickRemove: () => void;
}) => {
  return (
    <div className="relative inline-block">
      <Image
        className="rounded-xl"
        src={src}
        alt="attached item"
        height={200}
        width={200}
      />
      <Button
        variant="ghost"
        onClick={onClickRemove}
        className="absolute top-2 right-2 p-0 w-6 h-6 flex items-center justify-center bg-black bg-opacity-50 rounded-full hover:bg-opacity-70"
      >
        <X className="h-4 w-4 text-white" />
      </Button>
    </div>
  );
};
