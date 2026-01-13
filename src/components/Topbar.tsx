import React, { useState, useEffect } from "react";
import {
  Bars3Icon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

interface TopbarProps {
  toggleSidebar: () => void;
  userName?: string;
}

const Topbar: React.FC<TopbarProps> = ({
  toggleSidebar,
  userName = "Utilisateur",
}) => {
  const [greeting, setGreeting] = useState("Bonjour");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bonjour");
    else if (hour < 18) setGreeting("Bon après-midi");
    else setGreeting("Bonsoir");
  }, []);

  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-3 md:px-8">
      
      {/* Hamburger mobile */}
      <button
        className="text-gray-600 focus:outline-none md:hidden"
        onClick={toggleSidebar}
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* Titre */}
      <h2 className="text-lg md:text-xl font-semibold text-gray-800">
        {greeting}, {userName} !
      </h2>

      {/* Zone droite */}
      <div className="flex items-center space-x-4 relative">

        {/* Notifications */}
        <button className="relative text-gray-600 hover:text-gray-800">
          <BellIcon className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* Icône du user */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center focus:outline-none"
          >
            <UserCircleIcon className="h-10 w-10 text-gray-700 hover:text-gray-900" />
          </button>

          {/* Menu déroulant */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-gray-800 font-semibold">{userName}</p>
                <p className="text-gray-500 text-sm">admin@exemple.com</p>
              </div>
              <button className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100">
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                Déconnexion
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Topbar;
