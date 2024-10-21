import { useEffect, useState } from "react";
import { USER } from "../../Models/User";
import { IconPlane } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { NewUser } from "../../Services/Users";
import Sweetalert2 from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const Swal = withReactContent(Sweetalert2);

export default function SignUpPage() {

    const [user, setUser] = useState(USER);
    const navigate = useNavigate();

    const [importing, setImporting] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errorOnProcess, setErrorOnProcess] = useState(false);

    useEffect(() => {
        // Adiciona a classe ao body quando o componente é montado
        document.body.classList.add('bg-gradient');

        // Remove a classe ao desmontar o componente
        return () => {
            document.body.classList.remove('bg-gradient');
        };
    }, []);

    async function singUp() {

        const validate = validateInputs();
        if (!validate) return;

        setProcessing(true);
        setErrorOnProcess(null);

        try {
            const { nomeEmpregado, email, senha } = user;
            await NewUser({ nomeEmpregado, email, senha, idCargo: 2, ativo: true });

            Swal.fire({
                title: 'Usuário cadastrado!',
                text: "Seu usuário foi cadastrado com êxito.",
                icon: 'success',
                showCancelButton: false,
                confirmButtonText: 'OK',
            });

            navigate("/login");


        }
        catch (error) {
            setErrorOnProcess(error?.response?.data?.error || error.message);
        }

        setProcessing(false);
    }

    function validateInputs() {

        if (!user.nomeEmpregado) {
            setErrorOnProcess("Digite o seu nome.")
            return false;
        }

        if (!user.email) {
            setErrorOnProcess("Digite o seu e-mail.")
            return false;
        }

        if (!user.senha) {
            setErrorOnProcess("Digite o sua senha.")
            return false;
        }

        if (user.confirmarSenha != user.senha) {
            setErrorOnProcess("As senhas não conferem.")
            return false;
        }

        return true;

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


                                <div className="mb-3">
                                    <label className="form-label required" htmlFor="nameInput">Nome:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nameInput"
                                        placeholder="Digite seu nome..."
                                        required
                                        disabled={processing || importing}
                                        value={user.nomeEmpregado}
                                        onChange={({ target }) => setUser(_ => ({ ..._, nomeEmpregado: target.value }))}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label required" htmlFor="emailInput">Email:</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="emailInput"
                                        placeholder="Digite seu e-mail profissional..."
                                        required
                                        disabled={processing || importing}
                                        value={user.email}
                                        onChange={({ target }) => setUser(_ => ({ ..._, email: target.value }))}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label required" htmlFor="passwordInput">Senha:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="passwordInput"
                                        placeholder="Crie uma senha..."
                                        required
                                        disabled={processing || importing}
                                        value={user.senha}
                                        onChange={({ target }) => setUser(_ => ({ ..._, senha: target.value }))}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label required" htmlFor="passwordInput">Confirmar Senha:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="passwordInput"
                                        placeholder="Confirme sua senha..."
                                        required
                                        disabled={processing || importing}
                                        value={user.confirmarSenha}
                                        onChange={({ target }) => setUser(_ => ({ ..._, confirmarSenha: target.value }))}
                                    />
                                </div>


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
                                        {processing && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />}
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
        </>
    );

}