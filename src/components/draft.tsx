import { Pencil1Icon } from "@radix-ui/react-icons";

export const Draft = ({ content }: { content: string }) => {
  return (
    <>
      <div className="text-sm h-36 duration-200 hover:shadow-blue-300 shadow-md rounded-xl pt-2 pl-3 flex flex-col">
        <div className="flex items-center justify-center w-6 h-6 text-gray-500 bg-gray-100 rounded-full self-end mr-3">
          <Pencil1Icon className="w-4 h-5 text-gray-500" />
        </div>
        {content.slice(0, 100)}
      </div>
    </>
  );
};
