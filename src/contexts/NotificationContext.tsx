import { useState, ReactNode } from 'react';
import { Notification, NotificationType } from '../lib/types';
import { NotificationContext } from './NotificationContextDef';

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (message: string, type: NotificationType = "info", duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification = {
      id,
      message,
      type,
      duration,
    };

    setNotifications((prev) => [...prev, newNotification]);

    // Auto-remove notification after duration
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      showNotification,
      removeNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
