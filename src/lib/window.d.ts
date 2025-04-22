// this is global without needed of declaration
interface Window {
  ethereum?: any;
}

interface BoxProps {
  label: string;
  component: React.ComponentType<any>;
  theme: {
    dark: string;
    light: string;
  };
  [key: string]: any;
}

interface ApiResponse {
  success: boolean;
  message: string;
  code?: number;
  type?: NotificationType;
  data?: any;
}
interface ContractState {
  [functionName: string]: {
    functionSol: SolItem;
    args?: Record<string, string>;
    loading: boolean;
    response?: string;
    trigger?: boolean;
  };
}

//MyNotification ≠ Notification from react-notifications
interface MyNotification {
  id: string;
  message: string;
  type: NotificationType;
  duration: number;
}
