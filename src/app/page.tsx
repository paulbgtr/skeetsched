import { Button } from "@/components/ui/button";
import Link from "next/link";
import { StarFilledIcon } from "@radix-ui/react-icons";

export default function Home() {
  return (
    <div className="px-5 md:px-0">
      <header className="max-w-xl mx-auto space-y-4 my-[15rem]">
        <h1 className="font-bold text-7xl">
          Post Smarter on{" "}
          <span className="font-black text-blue-500">Bluesky</span>
        </h1>
        <p className="text-lg text-gray-300">
          Schedule posts for when it matters most. Simple, open source, and made
          for Bluesky.
        </p>
        <div className="flex gap-3">
          <Button asChild className="font-bold py-5">
            <Link href="/login">Get Started</Link>
          </Button>
          <Button variant="outline" asChild className="font-bold gap-1 py-5">
            <Link target="_blank" href="https://github.com/paulbgtr/skeetsched">
              <StarFilledIcon className="w-3 h-3" />
              Star on GitHub
            </Link>
          </Button>
        </div>
      </header>
    </div>
  );
}
