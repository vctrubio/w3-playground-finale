import { useNotifications } from '../hooks/useNotifications';

export default function Notifications() {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {notifications.map(notification => {
        // Set colors based on notification type
        const bgColor = 
          notification.type === 'success' ? 'bg-green-500 dark:bg-green-600' :
          notification.type === 'error' ? 'bg-red-500 dark:bg-red-600' :
          notification.type === 'warning' ? 'bg-yellow-500 dark:bg-yellow-600' :
          'bg-blue-500 dark:bg-blue-600';

        return (
          <div 
            key={notification.id}
            className={`${bgColor} text-white p-4 rounded shadow-lg flex justify-between items-start animate-fade-in`}
          >
            <p className="flex-1">{notification.message}</p>
            <button 
              onClick={() => removeNotification(notification.id)}
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
