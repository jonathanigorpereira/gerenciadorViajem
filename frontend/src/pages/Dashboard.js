import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Stats from "./components/Stats";
import RecentActivity from "./components/RecentActivity";
import MonthlyGoals from "./components/MonthlyGoals";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    alert("Logout realizado com sucesso!");
  };

  const fetchUserData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://localhost:3333/api/v1/auth/success",
        {
          withCredentials: true,
          timeout: 5000,
        }
      );
      setUserData(response.data);
    } catch (error) {
      console.error("Erro ao recuperar dados do usuário:", error);
      setError(
        "Falha ao carregar as informações do usuário. Por favor, tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} handleLogout={handleLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} userData={userData} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-12 w-3/4 bg-white animate-pulse rounded-lg"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-32 bg-white animate-pulse rounded-lg"
                  ></div>
                ))}
              </div>
              <div className="h-64 bg-white animate-pulse rounded-lg"></div>
            </div>
          ) : error ? (
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg"
              role="alert"
            >
              <p className="font-bold">Erro</p>
              <p>{error}</p>
              <button
                onClick={fetchUserData}
                className="mt-2 text-blue-600 underline"
              >
                Tentar novamente
              </button>
            </div>
          ) : userData ? (
            <>
              <h1 className="text-3xl font-bold mb-6 text-gray-800">
                Bem-vindo, {userData.user.nomeEmpregado}
              </h1>
              <Stats />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RecentActivity />
                <MonthlyGoals />
              </div>
            </>
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
