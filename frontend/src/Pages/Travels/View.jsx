import { useParams } from "react-router-dom";
import { TRAVEL } from "../../Models/Travel";
import { GetTravel } from "../../Services/Travels";
import { useEffect, useState, useRef, useContext } from "react";
import PageHeader from "../../Components/Header";
import { IconBuildingAirport } from "@tabler/icons-react";
import { GetFederativeUnits } from "../../Services/FederativeUnits";
import TravelDestination from "../../Components/Travels/Destination";
import { GetCities } from "../../Services/Cities";
import { GetUsers } from "../../Services/Users";
import { DateInput } from "../../Components/Forms/DateInput";
import { UserContext } from "../../Contexts/UserContext";

export default function Travels_ViewPage() {
  const { identifier } = useParams();
  const actualUser = useContext(UserContext);
  const lastDestinationRef = useRef(null);

  const [travel, setTravel] = useState(TRAVEL);
  const [users, setUsers] = useState([]);
  const [federativeUnits, setFederativeUnits] = useState([]);
  const [cities, setCities] = useState([]);

  const [importing, setImporting] = useState(false);
  const [importingUsers, setImportingUsers] = useState(false);
  const [importingFederativeUnits, setImportingFederativeUnits] =
    useState(false);
  const [importingCities, setImportingCities] = useState(false);

  useEffect(() => {
    getFederativeUnits();
    getUsers();
  }, []);

  useEffect(() => {
    getTravel();
  }, [identifier]);

  useEffect(() => {
    if (travel.unidadeFederativaId) {
      getCities();
    }
  }, [travel.unidadeFederativaId]);

  async function getUsers() {
    setImportingUsers(true);
    try {
      const result = await GetUsers();
      setUsers(result);
    } catch (error) {}
    setImportingUsers(false);
  }

  async function getFederativeUnits() {
    setImportingFederativeUnits(true);
    try {
      const result = await GetFederativeUnits();
      setFederativeUnits(result);
    } catch (error) {}
    setImportingFederativeUnits(false);
  }

  async function getCities() {
    setImportingCities(true);
    try {
      const result = await GetCities(travel.unidadeFederativaId);
      setCities(result);
    } catch (error) {}
    setImportingCities(false);
  }

  async function getTravel() {
    setImporting(true);
    try {
      const result = await GetTravel(identifier);
      setTravel(result);
    } catch (error) {}
    setImporting(false);
  }

  return (
    <>
      <PageHeader title="Visualizar Viagem" />

      <div className="row mb-3">
        <div className="col">
          <div className="card border-primary">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col">
                  <h6 className="card-title text-uppercase mb-0">
                    <IconBuildingAirport
                      className="me-2"
                      size={36}
                      stroke={1}
                    />
                    Origem
                  </h6>
                </div>
              </div>
            </div>
            <div className="card-body">
              {actualUser?.cargo?.idCargo === 1 && (
                <div className="row mb-3">
                  <div className="col-12 col-lg-6 mb-lg-0">
                    <label className="form-label required" htmlFor="nameInput">
                      Usuário:
                    </label>
                    <select
                      className="form-select"
                      disabled
                      value={travel.idEmpregado}
                    >
                      {importingUsers && (
                        <option selected disabled label="Carregando..." />
                      )}
                      {users.map((user) => (
                        <option
                          key={user.idEmpregado}
                          value={user.idEmpregado}
                          label={user.nomeEmpregado}
                        />
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="row mb-3">
                {/* Unidade Federativa */}
                <div className="col-12 col-lg mb-3 mb-lg-0">
                  <label className="form-label required" htmlFor="nameInput">
                    Unidade Federativa:
                  </label>
                  <select
                    className="form-select"
                    disabled
                    value={travel.unidadeFederativaId}
                  >
                    {importingFederativeUnits && (
                      <option selected disabled label="Carregando..." />
                    )}
                    {federativeUnits.map((federativeUnit) => (
                      <option
                        key={federativeUnit.idUnidadeFederativa}
                        value={federativeUnit.idUnidadeFederativa}
                        label={federativeUnit.NomeUnidadeFederativa}
                      />
                    ))}
                  </select>
                </div>

                {/* Cidade */}
                <div className="col-12 col-lg">
                  <label className="form-label required" htmlFor="nameInput">
                    Cidade:
                  </label>
                  <select
                    className="form-select"
                    disabled
                    value={travel.idMunicipioSaida}
                  >
                    {importingCities && (
                      <option selected disabled label="Carregando..." />
                    )}
                    {cities.map((city) => (
                      <option
                        key={city.idMunicipio}
                        value={city.idMunicipio}
                        label={city.NomeMunicipio}
                      />
                    ))}
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <label className="form-label required" htmlFor="nameInput">
                    Data Inicio:
                  </label>
                  <DateInput
                    value={travel?.DataInicioViagem || new Date()}
                    disabled
                  />
                </div>

                <div className="col">
                  <label className="form-label required" htmlFor="nameInput">
                    Data Final:
                  </label>
                  <DateInput
                    value={travel?.DataTerminoViagem || new Date()}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {travel.destinos.map((destination, index) => (
        <div
          className="row mb-3"
          key={index}
          ref={index === travel.destinos.length - 1 ? lastDestinationRef : null}
        >
          <div className="col">
            <TravelDestination
              {...destination}
              index={index}
              isViewMode={true}
            />
          </div>
        </div>
      ))}
    </>
  );
}
