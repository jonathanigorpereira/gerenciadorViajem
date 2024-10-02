import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import {
  FaBars,
  FaUserCircle,
  FaTachometerAlt,
  FaChartBar,
  FaCogs,
  FaQuestionCircle,
  FaSignOutAlt,
} from "react-icons/fa";

const Container = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f4f7fc;
`;

const Sidebar = styled.div`
  background-color: #1a1a2e;
  color: white;
  width: ${(props) => (props.isOpen ? "180px" : "60px")};
  transition: width 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.isOpen ? "flex-start" : "center")};
  padding: 20px;
  box-shadow: 3px 0 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  justify-content: space-between;

  &:hover {
    box-shadow: 6px 0 15px rgba(0, 0, 0, 0.3);
    transform: translateX(-3px);
  }
`;

const SidebarItem = styled.div`
  padding: 15px;
  width: 100%;
  margin: 10px 0;
  cursor: pointer;
  color: #e9f5e9;
  text-align: ${(props) => (props.isOpen ? "left" : "center")};
  font-size: ${(props) => (props.isOpen ? "16px" : "20px")};
  transition: all 0.3s;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #162447;
    border-radius: 8px;
  }

  svg {
    margin-right: ${(props) => (props.isOpen ? "10px" : "0")};
    font-size: 20px;
    transition: margin-right 0.3s ease;
  }
`;

const LogoutButton = styled(SidebarItem)`
  margin-top: 50px;
`;

const Content = styled.div`
  flex-grow: 1;
  padding: 20px;
  background-color: #f4f7fc;
`;

const Navbar = styled.div`
  background-color: #162447;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const MenuIcon = styled.div`
  font-size: 24px;
  cursor: pointer;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const UserName = styled.span`
  margin-right: 10px;
  font-size: 16px;
`;

const ContentSection = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-top: 20px;
`;

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    // Lógica para logout (ex: redirecionar para página de login)
    alert("Logout realizado com sucesso!");
  };

  // Função para buscar dados do usuário
  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3333/api/v1/auth/success",
        {
          withCredentials: true,
        }
      );
      setUserData(response.data);
    } catch (error) {
      console.error("Erro ao recuperar dados do usuário:", error);
      setError("Falha ao carregar as informações do usuário.");
    }
  };

  //Busca os dados do usuário
  useEffect(() => {
    fetchUserData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <div>Carregando...</div>;
  }

  return (
    <Container>
      <Sidebar isOpen={isSidebarOpen}>
        <div>
          <SidebarItem isOpen={isSidebarOpen}>
            <FaTachometerAlt />
            {isSidebarOpen && <span>Dashboard</span>}
          </SidebarItem>
          <SidebarItem isOpen={isSidebarOpen}>
            <FaChartBar />
            {isSidebarOpen && <span>Relatórios</span>}
          </SidebarItem>
          <SidebarItem isOpen={isSidebarOpen}>
            <FaCogs />
            {isSidebarOpen && <span>Configurações</span>}
          </SidebarItem>
          <SidebarItem isOpen={isSidebarOpen}>
            <FaQuestionCircle />
            {isSidebarOpen && <span>Ajuda</span>}
          </SidebarItem>
        </div>
        <LogoutButton isOpen={isSidebarOpen} onClick={handleLogout}>
          <FaSignOutAlt />
          {isSidebarOpen && <span>Logout</span>}
        </LogoutButton>
      </Sidebar>
      <Content>
        <Navbar>
          <MenuIcon onClick={toggleSidebar}>
            <FaBars />
          </MenuIcon>
          <UserInfo>
            <UserName>{userData.user.nomeEmpregado}</UserName>{" "}
            <FaUserCircle size={24} />
          </UserInfo>
        </Navbar>
        <ContentSection>
          <h1>Bem-vindo, {userData.user.nomeEmpregado}</h1>{" "}
          <p>Email: {userData.user.email}</p>
        </ContentSection>
        <ContentSection>
          <h2>Relatórios Recentes</h2>
          <p>
            Veja abaixo os relatórios mais recentes gerados pela plataforma.
          </p>
        </ContentSection>
      </Content>
    </Container>
  );
};

export default Dashboard;
