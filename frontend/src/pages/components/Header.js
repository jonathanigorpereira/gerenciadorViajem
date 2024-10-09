import React from "react";
import { Menu, User } from "lucide-react";

const Header = ({ toggleSidebar, userData }) => {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md">
      <div className="flex items-center justify-between px-6 py-4">
        <button onClick={toggleSidebar} className="text-white">
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">
            {userData ? userData.user.nomeEmpregado : "Carregando..."}
          </span>
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <User className="h-5 w-5 text-gray-600" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
