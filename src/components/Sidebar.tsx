import React from "react";
import {
  HomeIcon,
  DocumentIcon,
  CalendarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void; // fermer la sidebar sur mobile
}

const menuItems = [
  { name: "Accueil", icon: HomeIcon, path: "/" },
  { name: "Documents", icon: DocumentIcon, path: "/documents" },
  { name: "Feuilles de temps", icon: CalendarIcon, path: "/timesheets" },
  { name: "Entrées quotidiennes", icon: CalendarIcon, path: "/daily-entries" },
  { name: "Clients", icon: UserGroupIcon, path: "/clients" },
  { name: "Factures", icon: CurrencyDollarIcon, path: "/invoices" },
  { name: "Paramètres", icon: Cog6ToothIcon, path: "/settings" },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  return (
    <>
      {/* Overlay mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-white w-64 h-screen fixed top-0 left-0 z-30 transform transition-transform lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-20 border-b border-gray-800">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-12 w-auto object-contain"
            />
          </div>

          {/* Menu */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={toggleSidebar} // fermer sur mobile
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive ? "bg-gray-800" : "hover:bg-gray-700"
                  }`}
                >
                  <Icon className="h-6 w-6 text-[#f2a71a] mr-3" />
                  <span className="text-white font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-4 py-6 border-t border-gray-800 text-center">
            <p className="text-sm text-gray-400">
              MS INDUSTRIEL &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
