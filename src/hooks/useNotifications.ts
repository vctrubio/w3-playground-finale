import { useContext } from "react";
import { NotificationContext } from "../contexts/NotificationContextDef";

export const useNotifications = () => {
  const context = useContext(NotificationContext);

  if (context === undefined || context === null) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
