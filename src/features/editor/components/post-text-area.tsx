interface PostTextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const PostTextArea = ({ value, onChange }: PostTextAreaProps) => (
  <textarea
    onChange={onChange}
    value={value}
    className="w-full h-full p-3 border-[1px] border-gray-700 resize-none rounded-xl focus:outline-none bg-transparent"
    placeholder="What's up?"
  />
);
