import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";

// const NavButton = () => {
//   const { user } = useUser();

//   if (!user) {
//     return <div className="py-2 px-4"></div>;
//   }

//   return (
//     <div className="bg-purple-600 text-white py-2 px-4 rounded-full text-sm flex items-center">
//       Chain: {user.network.id}
//     </div>
//   );
// };

export function Navbar() {
    return (
        <nav className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow p-4 transition-colors animate-navbar-dropdown">
            <div className="container mx-auto flex justify-between items-center">
                <Logo />
                {/* <NavButton /> */}
                <ThemeToggle />
            </div>
        </nav>
    );
}
