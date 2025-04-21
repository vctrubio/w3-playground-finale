import { createContext } from 'react';
import { Notification, NotificationType } from '../lib/types';

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (message: string, type: NotificationType, duration?: number) => void;
  removeNotification: (id: string) => void;
}

export const NotificationContext = createContext<NotificationContextType | null>(null);
