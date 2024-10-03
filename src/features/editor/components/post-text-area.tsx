interface PostTextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  maxLength: number;
}

export const PostTextArea = ({
  value,
  onChange,
  maxLength,
}: PostTextAreaProps) => (
  <textarea
    onChange={onChange}
    value={value}
    className="w-full h-full p-3 border-[1px] border-gray-700 resize-none rounded-xl focus:outline-none bg-transparent"
    placeholder="What's up?"
    maxLength={maxLength}
  />
);
