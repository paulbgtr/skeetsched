import React, { createContext, useContext, useState } from "react";

type DraftContextType = {
  currentDraftId: string | null;
  setCurrentDraftId: React.Dispatch<React.SetStateAction<string | null>>;
};

const CurrentDraftContext = createContext<DraftContextType | undefined>(
  undefined
);

export const CurrentDraftProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);

  return (
    <CurrentDraftContext.Provider value={{ currentDraftId, setCurrentDraftId }}>
      {children}
    </CurrentDraftContext.Provider>
  );
};

export const useCurrentDraftContext = () => {
  const context = useContext(CurrentDraftContext);

  if (context === undefined) {
    throw new Error(
      "useCurrentDraftContext must be used within a CurrentDraftProvider"
    );
  }

  return context;
};
