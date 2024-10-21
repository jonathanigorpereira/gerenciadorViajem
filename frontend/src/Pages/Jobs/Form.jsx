import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { JOB } from "../../Models/Job";
import { EditJob, GetJob, NewJob } from "../../Services/Jobs";
import PageHeader from "../../Components/Header";
import { IconCheck } from "@tabler/icons-react";

export default function Jobs_FormPage() {

    const { identifier } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(JOB);

    const [importing, setImporting] = useState(false);
    const [processing, setProcessing] = useState(false);

    const [errorOnImport, setErrorOnImport] = useState(false);
    const [errorOnProcess, setErrorOnProcess] = useState(false);

    useEffect(() => { getJob(); }, [identifier]);

    async function getJob() {
        setImporting(true);
        try {
            const result = await GetJob(identifier);
            setJob(result);
        } catch (error) {
            setErrorOnImport(error?.response?.data?.message || error.message);
        }
        setImporting(false);
    }


    async function saveJob(params) {
        setProcessing(true);

        try {

            const { nomeCargo, ativo } = job;

            const result = identifier ?
                await EditJob(identifier, { nomeCargo, ativo }) :
                await NewJob({ nomeCargo, ativo });

            navigate("/cargos");

        } catch (error) {
            setErrorOnProcess(error?.response?.data?.message || error.message);
        }

        setProcessing(false);
    }

    return (
        <>
            <PageHeader title={identifier ? "Editar Cargo" : "Novo Cargo"}>
                <div className="row justify-content-end">
                    <div className="col-auto">
                        <button type="button" className="btn btn-primary" onClick={saveJob} disabled={processing || importing}>
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

                            <div className="row mb-3">
                                <div className="col">
                                    <label className="form-label required" htmlFor="nameInput">Nome:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nameInput"
                                        placeholder="Digite o nome do cargo..."
                                        required
                                        disabled={processing || importing}
                                        value={job.nomeCargo}
                                        onChange={({ target }) => setJob(_ => ({ ..._, nomeCargo: target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <div className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="ativoSwitch"
                                            required
                                            disabled={processing || importing}
                                            value={job.ativo}
                                            onChange={({ target }) => setJob(_ => ({ ..._, ativo: target.checked }))}
                                        />
                                        <label className="form-check-label" htmlFor="ativoSwitch">
                                            {job.ativo ? "Ativo" : "Inativo"}
                                        </label>
                                    </div>
                                </div>
                            </div>




                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}