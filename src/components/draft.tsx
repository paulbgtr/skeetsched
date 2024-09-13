import { useRouter } from "next/navigation";

export const Draft = ({ id, content }: { id: string; content: string }) => {
  const router = useRouter();

  return (
    <li
      className="text-sm cursor-pointer duration-200 hover:shadow-blue-300 shadow-md rounded-xl h-16 pt-2 pl-3"
      onClick={() => router.push(`/dashboard/post/${id}`)}
    >
      {content}
    </li>
  );
};
