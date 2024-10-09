import React from "react";
import { Activity } from "lucide-react";

const RecentActivity = () => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Atividade Recente
      </h2>
      <p className="text-gray-600 mb-4">Suas últimas ações no sistema</p>
      {[1, 2, 3].map((item) => (
        <div key={item} className="flex items-center space-x-4 mb-4">
          <div className="bg-blue-100 rounded-full p-2">
            <Activity className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">Ação {item}</p>
            <p className="text-xs text-gray-500">
              Há {item} hora{item !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;
