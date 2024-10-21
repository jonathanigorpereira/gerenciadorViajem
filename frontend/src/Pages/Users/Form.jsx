import { IconCheck } from "@tabler/icons-react";
import PageHeader from "../../Components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { USER } from "../../Models/User";
import { GetJobs } from "../../Services/Jobs";
import { EditUser, GetUser, NewUser } from "../../Services/Users";

export default function Users_FormPage() {

    const { identifier } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(USER);
    const [jobs, setJobs] = useState([]);

    const [importing, setImporting] = useState(false);
    const [processing, setProcessing] = useState(false);

    const [errorOnImport, setErrorOnImport] = useState(false);
    const [errorOnProcess, setErrorOnProcess] = useState(false);

    useEffect(() => { getJobs(); }, []);
    useEffect(() => { getUser(); }, [identifier]);

    async function getJobs() {
        try {
            const result = await GetJobs();
            setJobs(result);
        }
        catch (error) {

        }
    }

    async function getUser() {
        setImporting(true);
        try {
            const result = await GetUser(identifier);
            setUser({ ...result, idCargo: result.cargo.idCargo });
        } catch (error) {
            setErrorOnImport(error?.response?.data?.message || error.message);
        }
        setImporting(false);
    }

    async function saveUser() {

        setProcessing(true);

        try {

            const { nomeEmpregado, email, idCargo, senha, ativo } = user;

            const result = identifier ?
                await EditUser(identifier, { nomeEmpregado, email, idCargo, senha, ativo }) :
                await NewUser({ nomeEmpregado, email, idCargo, senha, ativo });

            navigate("/usuarios");

        } catch (error) {
            setErrorOnProcess(error?.response?.data?.message || error.message);
        }

        setProcessing(false);


    }

    return (
        <>
            <PageHeader title={identifier ? "Editar Usuário" : "Novo Usuário"}>
                <div className="row justify-content-end">
                    <div className="col-auto">
                        <button type="button" className="btn btn-primary" onClick={saveUser} disabled={processing || importing}>
                            {processing ? <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" /> : <IconCheck stroke={1} />}
                            {processing ? (identifier ? "Salvando..." : "Cadastrando...") : (identifier ? "Salvar Alterações" : "Cadastrar")}
                        </button>
                    </div>
                </div>
            </PageHeader>

            <div className="row">
                <div className="col">
                    <div className="card">
                        <div className="card-body">

                            <div className="mb-3">
                                <label className="form-label required" htmlFor="nameInput">Nome:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="nameInput"
                                    placeholder="Digite o nome do usuário ..."
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
                                    placeholder="Informe o e-mail do usuário ..."
                                    required
                                    disabled={processing || importing}
                                    value={user.email}
                                    onChange={({ target }) => setUser(_ => ({ ..._, email: target.value }))}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label required" htmlFor="jobSelect">Cargo:</label>
                                <select
                                    className="form-select"
                                    id="jobSelect"
                                    name="idCargo"
                                    required
                                    disabled={processing || importing}
                                    value={user.idCargo}
                                    onChange={({ target }) => setUser(_ => ({ ..._, idCargo: target.value }))}
                                >
                                    {
                                        jobs.map(job =>
                                            <option key={job.idCargo} job-id={job.idCargo} value={job.idCargo}>{job.nomeCargo}</option>
                                        )
                                    }
                                </select>
                            </div>

                            {
                                !identifier &&
                                <div className="mb-3">
                                    <label className="form-label required" htmlFor="passwordInput">Senha:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="passwordInput"
                                        placeholder="Digite a senha do usuário ..."
                                        required
                                        disabled={processing || importing}
                                        value={user.senha}
                                        onChange={({ target }) => setUser(_ => ({ ..._, senha: target.value }))}
                                    />
                                </div>
                            }

                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="ativoSwitch"
                                    required
                                    disabled={processing || importing}
                                    checked={user.ativo}
                                    onChange={({ target }) => setUser(_ => ({ ..._, ativo: target.checked }))}
                                />
                                <label className="form-check-label" htmlFor="ativoSwitch">
                                    {user.ativo ? "Ativo" : "Inativo"}
                                </label>
                            </div>



                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}