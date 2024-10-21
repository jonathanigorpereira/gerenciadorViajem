import { useState, useEffect, useLayoutEffect } from "react";
import axios from "axios";
import {
  IconBrandGoogle,
  IconLockPassword,
  IconMail,
  IconPlane,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingWithGoogle, setLoadingWithGoogle] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Adiciona a classe ao body quando o componente é montado
    document.body.classList.add("bg-gradient");

    // Remove a classe ao desmontar o componente
    return () => {
      document.body.classList.remove("bg-gradient");
    };
  }, []);

  // Captura o token da URL após o login com Google OAuth
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      // Armazena o token no localStorage
      localStorage.setItem("authorization", token);

      // Configura o cabeçalho de Authorization para futuras requisições
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Limpa o token da URL
      window.history.replaceState({}, document.title, "/");

      // Redireciona para o dashboard ou página principal
      window.location.href = "https://gerenciador-viajem.vercel.app/";
    }
  }, [navigate]);

  async function login() {
    setError(null);
    setLoading(true);

    try {
      const result = await axios.post("/auth/login", { email, senha });

      // Armazenar o token no localStorage
      localStorage.setItem("authorization", result.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${result.token}`;

      // Redireciona para a página principal ou para a URL desejada
      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get("redirectTo") || "/";
      window.location.href = redirectTo;
    } catch (error) {
      setError(error?.response?.data?.error || error.message);
    }

    setLoading(false);
  }

  async function loginWithGoogle() {
    setError(null);
    setLoadingWithGoogle(true);

    try {
      // Redireciona para a autenticação do Google OAuth
      window.location.href =
        "https://gerenciadorviajem.onrender.com/api/v1/auth/google";
    } catch (error) {
      setError(error?.response?.data?.error || error.message);
    }

    setLoadingWithGoogle(false);
  }

  return (
    <>
      <div className="container">
        <div className="row d-flex justify-content-center align-items-center vh-100">
          <div className="col-auto">
            <div className="card shadow-lg" style={{ width: "30rem" }}>
              <div className="card-body">
                <h2 className="card-title text-center mb-4">
                  <IconPlane
                    size={58}
                    stroke={1.5}
                    className="me-2 text-primary"
                    style={{ transform: "rotate(-30deg)" }}
                  />
                  Gerenciador de Viagens
                </h2>

                <div className="px-4">
                  {/* Email */}
                  <div className="input-group mb-4">
                    <span className="input-group-text pe-0">
                      <IconMail size={18} className="text-muted" />
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="E-mail"
                      required
                      disabled={loading}
                      value={email}
                      onChange={({ target }) => setEmail(target.value)}
                    />
                  </div>

                  {/* Senha */}
                  <div className="input-group mb-3">
                    <span className="input-group-text pe-0">
                      <IconLockPassword size={18} className="text-muted" />
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="senha"
                      placeholder="Senha"
                      required
                      disabled={loading}
                      value={senha}
                      onChange={({ target }) => setSenha(target.value)}
                      onKeyDownCapture={(e) => {
                        if (e.key === "Enter") login();
                      }}
                    />
                  </div>

                  <div className="d-grid gap-2 mb-2">
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={loading || loadingWithGoogle}
                      onClick={login}
                    >
                      {loading && (
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          aria-hidden="true"
                        />
                      )}
                      {loading ? "Entrando..." : "Entrar"}
                    </button>
                  </div>

                  <div className="d-grid gap-2">
                    <button
                      type="button"
                      className="btn btn-danger d-flex align-items-center justify-content-center"
                      disabled={loading || loadingWithGoogle}
                      onClick={loginWithGoogle}
                    >
                      {loadingWithGoogle && (
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          aria-hidden="true"
                        />
                      )}
                      {!loadingWithGoogle && (
                        <>
                          <IconBrandGoogle size={18} className="me-2" />
                          Login com Google
                        </>
                      )}
                      {loadingWithGoogle && "Autenticando..."}
                    </button>
                  </div>

                  <hr />
                  <div className="d-grid gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      disabled={loading || loadingWithGoogle}
                      onClick={() => navigate("/cadastrar")}
                    >
                      Novo Usuário
                    </button>
                  </div>

                  {error && (
                    <div className="mt-5">
                      <p>{error}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
