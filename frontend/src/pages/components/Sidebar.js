import React from "react";
import {
  BarChart,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Plane,
  Settings,
} from "lucide-react";

const Sidebar = ({ isSidebarOpen, handleLogout }) => {
  const sidebarItems = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard" },
    { icon: <BarChart className="h-5 w-5" />, label: "Relatórios" },
    { icon: <Settings className="h-5 w-5" />, label: "Configurações" },
    { icon: <HelpCircle className="h-5 w-5" />, label: "Ajuda" },
  ];

  return (
    <aside
      className={`bg-gradient-to-br from-blue-500 to-purple-600 text-white transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-center mb-8">
          <Plane className="h-8 w-8 text-white" />
          {isSidebarOpen && (
            <span className="ml-2 text-xl font-bold">
              Gerenciador de Viagens
            </span>
          )}
        </div>
        <div className="space-y-4 flex-grow">
          {sidebarItems.map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center px-4 py-2 text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors duration-200"
            >
              {item.icon}
              {isSidebarOpen && <span className="ml-2">{item.label}</span>}
            </button>
          ))}
        </div>
        <button
          className="w-full flex items-center px-4 py-2 text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors duration-200 mt-auto"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {isSidebarOpen && <span className="ml-2">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
