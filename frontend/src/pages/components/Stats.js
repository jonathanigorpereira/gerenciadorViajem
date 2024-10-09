import React from "react";
import { DollarSign, Plane, User } from "lucide-react";

const Stats = () => {
  const stats = [
    {
      icon: <Plane className="h-6 w-6 text-blue-600" />,
      label: "Viagens",
      value: "12",
      change: "+2.5%",
    },
    {
      icon: <User className="h-6 w-6 text-green-600" />,
      label: "Usuários",
      value: "120",
      change: "+5.0%",
    },
    {
      icon: <DollarSign className="h-6 w-6 text-yellow-600" />,
      label: "Gastos",
      value: "R$ 15,000",
      change: "+10.2%",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-600">{stat.label}</h2>
            {stat.icon}
          </div>
          <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
          <p className="text-xs text-gray-500">
            {stat.change} desde o último mês
          </p>
        </div>
      ))}
    </div>
  );
};

export default Stats;
