import React from "react";

type CharacterCounterProps = {
  current: number;
  max: number;
};

export const CharacterCounter = ({ current, max }: CharacterCounterProps) => {
  const isExceeded = current > max;
  const percentage = Math.min((current / max) * 100, 100);
  const strokeColor = isExceeded
    ? "red"
    : percentage > 80
      ? "orange"
      : "#1DA1F2"; // Twitter blue

  return (
    <div className="relative inline-flex items-center justify-center w-8 h-8">
      <svg className="w-full h-full" viewBox="0 0 32 32">
        <circle
          cx="16"
          cy="16"
          r="13"
          fill="none"
          stroke="#E1E8ED"
          strokeWidth="3"
        />
        <circle
          cx="16"
          cy="16"
          r="13"
          fill="none"
          stroke={strokeColor}
          strokeWidth="3"
          strokeDasharray="81.68"
          strokeDashoffset={81.68 - (percentage / 100) * 81.68}
          transform="rotate(-90 16 16)"
        />
      </svg>
      <span
        className={`absolute text-xs font-bold ${
          isExceeded ? "text-red-500" : "text-gray-500"
        }`}
      >
        {isExceeded ? max - current : current}
      </span>
    </div>
  );
};
