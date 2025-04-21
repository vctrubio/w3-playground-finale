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



interface ContractState {
  [functionName: string]: {
    functionSol: SolItem;
    args?: Record<string, string>;
    loading: boolean;
    response?: string;
    trigger?: boolean;
  };
}
