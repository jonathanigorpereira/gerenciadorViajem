import { useNavigate, useParams } from "react-router-dom";
import { FEDERATIVE_UNIT } from "../../Models/FederativeUnit";
import { useEffect, useState } from "react";
import PageHeader from "../../Components/Header";
import { IconCheck } from "@tabler/icons-react";
import { EditFederativeUnit, GetFederativeUnit, NewFederativeUnit } from "../../Services/FederativeUnits";

export default function FederativeUnits_FormPage() {

    const { identifier } = useParams();
    const navigate = useNavigate();

    const [federativeUnit, setFederativeUnit] = useState(FEDERATIVE_UNIT);

    const [importing, setImporting] = useState(false);
    const [processing, setProcessing] = useState(false);

    const [errorOnImport, setErrorOnImport] = useState(false);
    const [errorOnProcess, setErrorOnProcess] = useState(false);

    useEffect(() => { getFederativeUnit(); }, [identifier]);

    async function getFederativeUnit() {
        setImporting(true);
        try {
            const result = await GetFederativeUnit(identifier);
            setFederativeUnit(result);
        } catch (error) {
            setErrorOnImport(error?.response?.data?.message || error.message);
        }
        setImporting(false);
    }

    async function saveFederativeUnit() {
        setProcessing(true);

        try {

            const { NomeUnidadeFederativa, SiglaUnidadeFederativa, ativo } = federativeUnit;

            const result = identifier ?
                await EditFederativeUnit(identifier, { NomeUnidadeFederativa, SiglaUnidadeFederativa, ativo }) :
                await NewFederativeUnit({ NomeUnidadeFederativa, SiglaUnidadeFederativa, ativo });

            navigate("/unidades-federativas");

        } catch (error) {
            setErrorOnProcess(error?.response?.data?.message || error.message);
        }

        setProcessing(false);
    }

    return (
        <>
            <PageHeader title={identifier ? "Editar Unidade Federativa" : "Nova Unidade Federativa"}>
                <div className="row justify-content-end">
                    <div className="col-auto">
                        <button type="button" className="btn btn-primary" onClick={saveFederativeUnit} disabled={processing || importing}>
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
                                <div className="col-8">
                                    <label className="form-label required" htmlFor="nameInput">Nome:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nameInput"
                                        placeholder="Digite o nome da unidade federativa..."
                                        required
                                        disabled
                                        value={federativeUnit.NomeUnidadeFederativa}
                                        onChange={({ target }) => setFederativeUnit(_ => ({ ..._, NomeUnidadeFederativa: target.value }))}
                                    />
                                </div>
                                <div className="col">
                                    <label className="form-label required" htmlFor="emailInput">Sigla:</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="emailInput"
                                        placeholder="Digite a sigla da unidade federativa..."
                                        required
                                        disabled
                                        value={federativeUnit.SiglaUnidadeFederativa}
                                        onChange={({ target }) => setFederativeUnit(_ => ({ ..._, SiglaUnidadeFederativa: target.value }))}
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
                                            checked={federativeUnit.ativo}
                                            onChange={({ target }) => setFederativeUnit(_ => ({ ..._, ativo: target.checked }))}
                                        />
                                        <label className="form-check-label" htmlFor="ativoSwitch">
                                            {federativeUnit.ativo ? "Ativo" : "Inativo"}
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