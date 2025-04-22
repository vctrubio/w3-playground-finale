import { useState, useRef, useEffect, ReactNode } from 'react';

interface BusinessCardSection {
  title: string;
  icon: string;
  content: ReactNode;
}

const BUSINESS_CARD_SECTIONS: BusinessCardSection[] = [
  {
    title: "Project",
    icon: "📚",
    content: "A project for Metana Module 3 Web3 Bootcamp"
  },
  {
    title: "About Me",
    icon: "👨‍💻",
    content: "Full stack developer with emphasis on backend development"
  },
  {
    title: "Contact",
    icon: "📧",
    content: (
      <a href="mailto:vctrubio@gmail.com" className="text-blue-500 hover:underline hover:text-blue-600 transition-colors">
        vctrubio@gmail.com
      </a>
    )
  }
];

export default function Logo() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  //slight bug on isOpen z-50 not rendering on top of page
  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="w-8 h-8 dark:bg-blue-600 rounded-md flex items-center justify-center bg-orange-500 transition-transform hover:scale-105"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-white font-bold text-xs hover:dark:text-orange-500 hover:text-blue-600 cursor-pointer">w3</span>
      </div>

      {isOpen && (
        <div className="absolute top-10 left-0 bg-white dark:bg-gray-800 z-50 rounded-lg shadow-xl p-5 w-80 border border-gray-200 dark:border-gray-700 transition-all">
          <div className="flex flex-col space-y-5">
            {BUSINESS_CARD_SECTIONS.map((section, index) => (
              <div key={index} className="flex items-start space-x-3 group hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-md transition-all">
                <div className="flex-shrink-0 w-9 h-9 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                  <span role="img" aria-label={section.title} className="text-lg">{section.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-dashed border-gray-300 dark:border-gray-600 pb-1 mb-1">{section.title}</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {typeof section.content === 'string' ? section.content : section.content}
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                &copy; {new Date().getFullYear()} by vctrubio
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
