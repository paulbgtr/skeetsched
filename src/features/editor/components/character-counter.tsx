type CharacterCounterProps = {
  current: number;
  max: number;
};

export const CharacterCounter = ({ current, max }: CharacterCounterProps) => {
  const isExceeded = current > max;

  return (
    <span className={`${!isExceeded ? "text-gray-500" : "text-red-500"}`}>
      {isExceeded ? max - current : `${current}/${max}`}
    </span>
  );
};
