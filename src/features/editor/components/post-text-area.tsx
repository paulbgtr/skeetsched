import React, { useRef, useEffect } from "react";

interface PostTextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const PostTextArea = ({ value, onChange }: PostTextAreaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const urlRegex = new RegExp(
    "(" +
      // Protocol URLs (http:// or https://)
      "(?:https?:\\/\\/|)" +
      // Domain name with optional www.
      "(?:www\\.|)" +
      // Domain with optional subdomains
      "[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*" +
      // TLD (2 or more characters)
      "\\.[a-zA-Z]{2,}" +
      // Optional path, query parameters, hash
      "(?:\\/[^\\s]*)?" +
      ")",
    "gi"
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    const overlay = overlayRef.current;

    if (!textarea || !overlay) return;

    const syncScroll = () => {
      overlay.scrollTop = textarea.scrollTop;
      overlay.scrollLeft = textarea.scrollLeft;
    };

    textarea.addEventListener("scroll", syncScroll);
    return () => textarea.removeEventListener("scroll", syncScroll);
  }, []);

  const renderHighlightedText = () => {
    const segments = [];
    let lastIndex = 0;
    let match;

    urlRegex.lastIndex = 0;

    while ((match = urlRegex.exec(value)) !== null) {
      if (match.index > lastIndex) {
        segments.push(
          <span key={`text-${lastIndex}`} className="text-white">
            {value.slice(lastIndex, match.index)}
          </span>
        );
      }

      segments.push(
        <span key={`link-${match.index}`} className="text-blue-500">
          {match[0]}
        </span>
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < value.length) {
      segments.push(
        <span key={`text-${lastIndex}`} className="text-white">
          {value.slice(lastIndex)}
        </span>
      );
    }

    return segments;
  };

  return (
    <div className="relative w-full h-full">
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="absolute w-full h-full p-3 whitespace-pre-wrap break-words pointer-events-none overflow-hidden"
      >
        {value ? renderHighlightedText() : null}
      </div>
      <textarea
        ref={textareaRef}
        onChange={onChange}
        value={value}
        className="relative w-full h-full p-3 resize-none focus:outline-none bg-transparent placeholder:text-gray-500 text-transparent caret-white overflow-auto"
        style={{
          caretColor: "white",
        }}
        placeholder="What's up?"
      />
    </div>
  );
};
