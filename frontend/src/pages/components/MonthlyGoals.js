import React from "react";

const MonthlyGoals = () => {
  const goals = [
    { label: "Viagens Planejadas", progress: 75 },
    { label: "Economia", progress: 50 },
    { label: "Satisfação", progress: 90 },
  ];

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Metas do Mês</h2>
      <p className="text-gray-600 mb-4">Seu progresso até agora</p>
      {goals.map((goal, index) => (
        <div key={index} className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-600">
              {goal.label}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {goal.progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${goal.progress}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MonthlyGoals;
