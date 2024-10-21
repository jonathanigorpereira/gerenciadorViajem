import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../Components/Header";
import { useEffect, useState } from "react";
import { CITY } from "../../Models/City";
import { EditCity, GetCity, NewCity } from "../../Services/Cities";
import { IconCheck } from "@tabler/icons-react";
import { GetFederativeUnits } from "../../Services/FederativeUnits";

export default function Cities_FormPage() {

    const { identifier } = useParams();
    const navigate = useNavigate();

    const [city, setCity] = useState(CITY);
    const [federativeUnits, setFederativeUnits] = useState([]);

    const [importing, setImporting] = useState(false);
    const [processing, setProcessing] = useState(false);

    const [errorOnImport, setErrorOnImport] = useState(false);
    const [errorOnProcess, setErrorOnProcess] = useState(false);

    useEffect(() => { getFederativeUnits(); }, []);
    useEffect(() => { getCity(); }, [identifier]);

    async function getFederativeUnits() {
        try {
            const result = await GetFederativeUnits();
            setFederativeUnits(result);
        } catch (error) {

        }

    }

    async function getCity() {
        setImporting(true);
        try {
            const result = await GetCity(identifier);
            setCity(result);
        } catch (error) {
            setErrorOnImport(error?.response?.data?.message || error.message);
        }
        setImporting(false);
    }

    async function saveCity() {
        setProcessing(true);

        try {

            const { NomeMunicipio, idUnidadeFederativa, ativo } = city;

            const result = identifier ?
                await EditCity(identifier, { NomeMunicipio, idUnidadeFederativa, ativo }) :
                await NewCity({ NomeMunicipio, idUnidadeFederativa, ativo });

            navigate("/cidades");

        } catch (error) {
            setErrorOnProcess(error?.response?.data?.message || error.message);
        }

        setProcessing(false);
    }

    return (
        <>
            <PageHeader title={identifier ? "Editar Cidade" : "Nova Cidade"}>
                <div className="row justify-content-end">
                    <div className="col-auto">
                        <button type="button" className="btn btn-primary" onClick={saveCity} disabled={processing || importing}>
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
                                        placeholder="Digite o nome da cidade..."
                                        required
                                        disabled
                                        value={city.NomeMunicipio}
                                        onChange={({ target }) => setCity(_ => ({ ..._, NomeMunicipio: target.value }))}
                                    />
                                </div>
                                <div className="col">
                                    <label className="form-label required" htmlFor="federativeUnitSelect">Unidade Federativa:</label>
                                    <select
                                        className="form-select"
                                        id="federativeUnitSelect"
                                        required
                                        disabled
                                        value={city.idUnidadeFederativa}
                                        onChange={({ target }) => setCity(_ => ({ ..._, idUnidadeFederativa: target.value }))}
                                    >
                                        {
                                            federativeUnits.map(federativeUnit =>
                                                <option key={federativeUnit.idUnidadeFederativa} federative-unit-id={federativeUnit.idUnidadeFederativa} value={federativeUnit.idUnidadeFederativa}>{federativeUnit.NomeUnidadeFederativa}</option>
                                            )
                                        }
                                    </select>
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
                                            checked={city.ativo}
                                            onChange={({ target }) => setCity(_ => ({ ..._, ativo: target.checked }))}
                                        />
                                        <label className="form-check-label" htmlFor="ativoSwitch">
                                            {city.ativo ? "Ativo" : "Inativo"}
                                        </label>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}