import { JSX, useState } from 'react';

function Box({
  label,
  component: Component,
  theme,
  ...componentProps
}: BoxProps): JSX.Element {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const toggleVisibility = () => {
    setIsVisible(prev => !prev);
  };

  return (
    <div className="relative border p-4 rounded m-8 min-h-20 border-gray-200 dark:border-gray-700">
      <div
        className={`absolute left-2 top-0 -mt-5 z-10 p-2 border rounded cursor-pointer ${theme.light} dark:${theme.dark} dark:text-zinc-800 text-orange-500 text-xl font-bold`}
        onClick={toggleVisibility}
      >
        {label} {isVisible ? '[X]' : '▶'}
      </div>
      <div
        className={`pt-4 transition-all duration-300 ease-in-out ${isVisible
          ? 'opacity-100 max-h-screen'
          : 'opacity-0 max-h-0 overflow-hidden'
          }`}
      >
        <div className="mt-6 overflow-y-auto max-h-[800px]">
          <Component {...componentProps} />
        </div>
      </div>
    </div>
  );
}

export function BoxContainer({ modules }: { modules: BoxProps[] }): JSX.Element {
  return (
    <div>
      {modules.map((module) => (
        <Box key={module.id} {...module} />
      ))}
    </div>
  );
}
