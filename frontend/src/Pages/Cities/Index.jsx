import { useEffect, useState } from "react";
import { GetCities } from "../../Services/Cities";
import PageHeader from "../../Components/Header";
import { IconBuilding, IconBuildingAirport, IconBuildingArch, IconBuildingBank, IconBuildingBridge, IconBuildingCommunity, IconMap, IconMapPin, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import Spinner from "../../Components/Spinner";
import { Link } from "react-router-dom";
import { GetFederativeUnits } from "../../Services/FederativeUnits";

export default function Cities_IndexPage() {

    const [federativeUnits, setFederativeUnits] = useState([]);
    const [cities, setCities] = useState([]);

    const [federativeUnitID, setFederativeUnitID] = useState(null);
    const [cityID, setCityID] = useState(null);

    const [importingCities, setImportingCities] = useState(false);
    const [errorOnImport, setErrorOnImport] = useState();

    useEffect(() => { getfederativeUnits() }, []);
    useEffect(() => { if (federativeUnitID) { getCities() } }, [federativeUnitID]);


    async function getCities() {
        setImportingCities(true);
        setErrorOnImport(null);

        try {
            const result = await GetCities(federativeUnitID);
            setCities(result);
        } catch (error) {
            setErrorOnImport(error?.response?.data?.message || error.message);
        }

        setImportingCities(false);
    }

    async function getfederativeUnits() {
        try {
            const result = await GetFederativeUnits();
            setFederativeUnits(result);

        } catch (error) {

        }
    }

    return (
        <>
            <PageHeader title="Cidades" titleRow>
                <div className="row justify-content-end">

                    <div className="col col-lg-5">
                        <div className="input-group flex-nowrap">
                            <span className="input-group-text" id="addon-wrapping">
                                <IconMap stroke={1} size={26} />
                            </span>
                            <select className="form-select" value={federativeUnitID} onChange={({ target }) => setFederativeUnitID(target.value)}>
                                {federativeUnitID == null && <option selected disabled label="Selecionar Unidade Federativa..." />}
                                {federativeUnits.map(federativeUnit =>
                                    <option
                                        key={federativeUnit.idUnidadeFederativa}
                                        value={federativeUnit.idUnidadeFederativa}
                                        label={federativeUnit.NomeUnidadeFederativa}
                                    />
                                )}
                            </select>
                        </div>
                    </div>
                </div>
            </PageHeader>

            <div className="row">
                <div className="col">
                    <div className="card">
                        <div className="card-body">
                            {
                                federativeUnitID == null ?
                                    <>
                                        <p className="mb-0">Selecione uma unidade federativa!</p>
                                    </> :
                                    importingCities ? <Spinner /> :
                                        errorOnImport ?
                                            <>
                                                <h6 className="mb-0">Erro:</h6>
                                                <p className="mb-0">{errorOnImport}</p>
                                            </>
                                            :
                                            <div className="table-responsive-lg">
                                                <table className="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col" className="small text-muted text-uppercase">Cidade</th>
                                                            <th scope="col" className="small text-muted text-uppercase text-center">Status</th>
                                                            <th scope="col" />
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            cities.map(city =>
                                                                <tr key={city.idMunicipio} city-id={city.idMunicipio} unit-id={city.idUnidadeFederativa}>
                                                                    <td>
                                                                        <div className="d-flex align-items-center">
                                                                            <IconMapPin stroke={1} size={38} />
                                                                            <div className="position-relative d-flex flex-column ms-2">
                                                                                <span className="d-inline-block">{city.NomeMunicipio}</span>
                                                                            </div>
                                                                        </div>
                                                                    </td>


                                                                    <td className="text-center">
                                                                        {city.ativo ? "Ativo" : "Inativo"}
                                                                    </td>


                                                                    <td className="text-end">
                                                                        <div className="dropdown">
                                                                            <button className="btn btn-sm dropdown-toggle px-3" type="button" data-bs-toggle="dropdown" />
                                                                            <ul className="dropdown-menu dropdown-menu-end">
                                                                                <li>
                                                                                    <Link className="dropdown-item" to={`/cidades/editar/${city.idMunicipio}`}>
                                                                                        <IconPencil className="icon me-2" stroke={1} size={18} style={{ marginTop: "-4px" }} />
                                                                                        Editar
                                                                                    </Link>
                                                                                </li>
                                                                                {/* <li>
                                                                                    <a className="dropdown-item">
                                                                                        <IconTrash className="icon me-2" stroke={1} size={18} style={{ marginTop: "-4px" }} />
                                                                                        Excluir
                                                                                    </a>
                                                                                </li> */}
                                                                            </ul>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

        </>
    )

}