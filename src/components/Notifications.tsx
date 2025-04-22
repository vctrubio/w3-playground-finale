import { useNotifications } from '../hooks/useNotifications';
import { useState } from 'react';

export default function Notifications() {
  const { notifications, removeNotification } = useNotifications();
  const [exitingIds, setExitingIds] = useState<string[]>([]);

  // Handle notification removal with animation
  const handleRemove = (id: string) => {
    setExitingIds((prev) => [...prev, id]);
    
    // Wait for animation to complete before actually removing
    setTimeout(() => {
      removeNotification(id);
      setExitingIds((prev) => prev.filter((exitId) => exitId !== id));
    }, 300); // Match animation duration
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 left-4 z-50 flex flex-col gap-2 max-w-md">
      {notifications.map(notification => {
        // Set colors based on notification type
        const bgColor =
          notification.type === 'success' ? 'bg-emerald-500 dark:bg-emerald-600' :
            notification.type === 'error' ? 'bg-fuchsia-500 dark:bg-fuchsia-600' :
              notification.type === 'warning' ? 'bg-amber-500 dark:bg-amber-600' :
                'bg-blue-500 dark:bg-blue-600';

        const isExiting = exitingIds.includes(notification.id);
        
        return (
          <div
            key={notification.id}
            className={`${bgColor} text-white p-4 rounded shadow-lg flex justify-between items-start 
              ${isExiting ? 'animate-slide-out-left' : 'animate-slide-in-left'}`}
          >
            <p className="flex-1">{notification.message}</p>
            <button
              onClick={() => handleRemove(notification.id)}
              className="ml-4 text-white hover:text-gray-200"
              aria-label="Close notification"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}
