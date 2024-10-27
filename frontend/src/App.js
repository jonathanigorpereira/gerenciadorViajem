import "./App.css";
import { RouterProvider } from "react-router-dom";
import { PrivateRoutes } from "./Routes/Private.Routes";
import { PublicRoutes } from "./Routes/Public.Routes";
import { UserContext } from "./Contexts/UserContext";
import { useEffect, useState } from "react";
import { GetActualUser } from "./Services/Users";
import axios from "axios";

function App() {
  // Configurações iniciais do Axios
  axios.defaults.baseURL = "https://gerenciadorviajem.onrender.com/api/v1";

  // Configurando o interceptor para lidar com erros de autenticação
  axios.interceptors.response.use(
    (response) => {
      // Se a resposta for bem-sucedida, retornar os dados
      return response ? response?.data || response : null;
    },
    (error) => {
      // Verifica se o status é 401 (não autorizado)
      if (error.response && error.response.status === 401) {
        // Remove o token do localStorage se o status for 401
        localStorage.removeItem("authorization");
        sessionStorage.setItem("authorizationExpired", "true");
        const redirectTo = encodeURIComponent(window.location.pathname);
        window.location.href = `/login?redirectTo=${redirectTo}`;
      }

      // Retorna a Promise rejeitada para que outros handlers possam manipular o erro
      return Promise.reject(error);
    }
  );

  const [user, setUser] = useState(null);
  const [authorization, setAuthorization] = useState(
    localStorage.getItem("authorization")
  );

  // Função para capturar o token JWT do Google OAuth
  const captureTokenFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      // Armazena o token no localStorage
      localStorage.setItem("authorization", token);
      setAuthorization(token);

      // Configura o cabeçalho de Authorization para futuras requisições
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Limpa o token da URL e redireciona para a página principal
      window.history.replaceState({}, document.title, "/");
    }
  };

  useEffect(() => {
    // Captura o token da URL (fluxo de autenticação via Google OAuth)
    captureTokenFromURL();

    // Se o usuário já estiver autenticado (via e-mail/senha ou token OAuth), busca as informações do usuário
    if (authorization) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${authorization}`;
      getUser();
    }
  }, [authorization]);

  // Função para buscar os dados do usuário autenticado
  async function getUser() {
    try {
      const result = await GetActualUser();
      if (result) {
        setUser(result);
      } else {
        console.error("Nenhum dado de usuário retornado");
      }
    } catch (error) {
      console.error("Erro ao buscar o usuário:", error);
    }
  }

  // Verifica se o token existe para carregar as rotas apropriadas
  const router = authorization ? PrivateRoutes : PublicRoutes;

  return (
    <UserContext.Provider value={user}>
      <RouterProvider router={router} />
    </UserContext.Provider>
  );
}

export default App;
