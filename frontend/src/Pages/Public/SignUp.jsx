import { useEffect, useState } from "react";
import { USER } from "../../Models/User";
import { IconPlane } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { NewUser } from "../../Services/Users";
import Sweetalert2 from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const Swal = withReactContent(Sweetalert2);

export default function SignUpPage() {
  const [user, setUser] = useState(USER);
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
    match: true, // Inicializamos como true, pois inicialmente as senhas não foram digitadas
  });
  const [processing, setProcessing] = useState(false);
  const [errorOnProcess, setErrorOnProcess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("bg-gradient");
    return () => {
      document.body.classList.remove("bg-gradient");
    };
  }, []);

  const validatePassword = (password, confirmPassword) => {
    const validations = {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password), // Adiciona um caractere especial
      match: password && confirmPassword && password === confirmPassword, // Verifica se ambas estão preenchidas e são iguais
    };
    setPasswordValidations(validations);
    return validations;
  };

  const handlePasswordChange = (password) => {
    setUser((prev) => ({ ...prev, senha: password }));
    validatePassword(password, user.confirmarSenha);
  };

  const handleConfirmPasswordChange = (confirmPassword) => {
    setUser((prev) => ({ ...prev, confirmarSenha: confirmPassword }));
    validatePassword(user.senha, confirmPassword);
  };

  async function singUp() {
    if (!validateInputs()) return;

    setProcessing(true);
    setErrorOnProcess(null);

    try {
      const { nomeEmpregado, email, senha } = user;
      await NewUser({ nomeEmpregado, email, senha, idCargo: 2, ativo: true });

      Swal.fire({
        title: "Usuário cadastrado!",
        text: "Seu usuário foi cadastrado com êxito.",
        icon: "success",
        showCancelButton: false,
        confirmButtonText: "OK",
      });

      navigate("/login");
    } catch (error) {
      setErrorOnProcess(error?.response?.data?.error || error.message);
    }

    setProcessing(false);
  }

  function validateInputs() {
    if (!user.nomeEmpregado) {
      setErrorOnProcess("Digite o seu nome.");
      return false;
    }

    if (!user.email) {
      setErrorOnProcess("Digite o seu e-mail.");
      return false;
    }

    if (!user.senha) {
      setErrorOnProcess("Digite a sua senha.");
      return false;
    }

    const validPassword = validatePassword(user.senha, user.confirmarSenha);
    if (
      !validPassword.length ||
      !validPassword.upper ||
      !validPassword.lower ||
      !validPassword.number ||
      !validPassword.special
    ) {
      setErrorOnProcess("A senha deve atender a todos os requisitos.");
      return false;
    }

    if (!validPassword.match) {
      setErrorOnProcess("As senhas não coincidem.");
      return false;
    }

    return true;
  }

  return (
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

              <div className="mb-3">
                <label className="form-label required" htmlFor="nameInput">
                  Nome:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nameInput"
                  placeholder="Digite seu nome..."
                  required
                  disabled={processing}
                  value={user.nomeEmpregado}
                  onChange={({ target }) =>
                    setUser((_) => ({ ..._, nomeEmpregado: target.value }))
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label required" htmlFor="emailInput">
                  Email:
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="emailInput"
                  placeholder="Digite seu e-mail profissional..."
                  required
                  disabled={processing}
                  value={user.email}
                  onChange={({ target }) =>
                    setUser((_) => ({ ..._, email: target.value }))
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label required" htmlFor="passwordInput">
                  Senha:
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="passwordInput"
                  placeholder="Crie uma senha..."
                  required
                  disabled={processing}
                  value={user.senha}
                  onChange={({ target }) => handlePasswordChange(target.value)}
                />
              </div>

              <div className="mb-3">
                <label
                  className="form-label required"
                  htmlFor="confirmPasswordInput"
                >
                  Confirmar Senha:
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPasswordInput"
                  placeholder="Confirme sua senha..."
                  required
                  disabled={processing}
                  value={user.confirmarSenha}
                  onChange={({ target }) =>
                    handleConfirmPasswordChange(target.value)
                  }
                />
              </div>

              {/* Validação de senha sempre visível */}
              <ul className="mt-2 small">
                <li
                  style={{
                    color: passwordValidations.length ? "green" : "red",
                  }}
                >
                  Mínimo de 8 caracteres
                </li>
                <li
                  style={{ color: passwordValidations.upper ? "green" : "red" }}
                >
                  Pelo menos uma letra maiúscula
                </li>
                <li
                  style={{ color: passwordValidations.lower ? "green" : "red" }}
                >
                  Pelo menos uma letra minúscula
                </li>
                <li
                  style={{
                    color: passwordValidations.number ? "green" : "red",
                  }}
                >
                  Pelo menos um número
                </li>
                <li
                  style={{
                    color: passwordValidations.special ? "green" : "red",
                  }}
                >
                  Pelo menos um caractere especial (!@#$%^&*)
                </li>
              </ul>

              {/* Exibe a mensagem de senhas não coincidem apenas se ambas as senhas forem preenchidas e não coincidirem */}
              {!passwordValidations.match &&
                user.senha &&
                user.confirmarSenha && (
                  <p className="text-danger small mt-2">
                    As senhas não coincidem.
                  </p>
                )}

              {errorOnProcess && (
                <div className="my-4 text-center text-bg-danger py-2 rounded-3">
                  <p className="p-0 m-0">{errorOnProcess}</p>
                </div>
              )}

              <div className="d-grid gap-2">
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={processing}
                  onClick={singUp}
                >
                  {processing && (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      aria-hidden="true"
                    />
                  )}
                  {processing ? "Cadastrando..." : "Cadastrar"}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={processing}
                  onClick={() => navigate("/login")}
                >
                  Voltar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
