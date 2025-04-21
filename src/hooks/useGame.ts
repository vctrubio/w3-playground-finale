import { useContext } from "react";
import { GameContext } from "../contexts/GameContextDef";

export const useGame = () => {
  const context = useContext(GameContext);

  if (context === undefined || context === null) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
