import { useContext } from "react";
import { UserContext } from "../contexts/UserContextDef";

export const useUser = () => {
  const context = useContext(UserContext);

  if (context === undefined || context === null) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
