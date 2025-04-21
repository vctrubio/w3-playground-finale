import { createContext } from 'react';


interface NotificationContextType {
  notifications: MyNotification[];
  showNotification: (message: string, type: NotificationType, duration?: number) => void;
  removeNotification: (id: string) => void;
}

export const NotificationContext = createContext<NotificationContextType | null>(null);
