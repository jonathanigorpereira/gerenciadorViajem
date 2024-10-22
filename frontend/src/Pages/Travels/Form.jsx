import { useNavigate, useParams } from "react-router-dom";
import { TRAVEL } from "../../Models/Travel";
import { EditTravel, GetTravel, NewTravel } from "../../Services/Travels";
import { useEffect, useState, useRef, useContext } from "react";
import PageHeader from "../../Components/Header";
import {
  IconBuildingAirport,
  IconCheck,
  IconPlaneArrival,
  IconPlus,
  IconTrash,
  IconUser,
} from "@tabler/icons-react";
import { GetFederativeUnits } from "../../Services/FederativeUnits";
import TravelDestination from "../../Components/Travels/Destination";
import { GetCities } from "../../Services/Cities";
import { GetUsers } from "../../Services/Users";
import Sweetalert2 from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { DateInput } from "../../Components/Forms/DateInput";
import { UserContext } from "../../Contexts/UserContext";
const Swal = withReactContent(Sweetalert2);

export default function Travels_FormPage() {
  const { identifier } = useParams();
  const actualUser = useContext(UserContext);
  const navigate = useNavigate();
  const lastDestinationRef = useRef(null);

  const [travel, setTravel] = useState(TRAVEL);
  const [destinos, setDestinos] = useState(travel.destinos);

  const [users, setUsers] = useState([]);
  const [federativeUnits, setFederativeUnits] = useState([]);
  const [cities, setCities] = useState([]);

  const [importing, setImporting] = useState(false);
  const [importingUsers, setImportingUsers] = useState(false);
  const [importingFederativeUnits, setImportingFederativeUnits] =
    useState(false);
  const [importingCities, setImportingCities] = useState(false);

  const [processing, setProcessing] = useState(false);

  const [errorOnImport, setErrorOnImport] = useState(false);
  const [errorOnProcess, setErrorOnProcess] = useState(false);
  const [errorOnImportUsers, setErrorOnImportUsers] = useState();

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

  useEffect(() => {
    if (actualUser)
      setTravel((_) => ({ ..._, idEmpregado: actualUser.idEmpregado }));
  }, [actualUser]);

  async function getUsers() {
    setImportingUsers(true);
    setErrorOnImportUsers(null);

    try {
      const result = await GetUsers();
      setUsers(result);
    } catch (error) {
      setErrorOnImportUsers(error?.response?.data?.message || error.message);
    }

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
    } catch (error) {
      setErrorOnImport(error?.response?.data?.message || error.message);
    }
    setImporting(false);
  }

  async function saveTravel() {
    setProcessing(true);
    setErrorOnProcess(null);

    const updatedTravel = {
      ...travel,
      idEmpregado: travel.idEmpregado || actualUser.idEmpregado,
      DataInicioViagem: travel.DataInicioViagem || new Date(),
      DataTerminoViagem: travel.DataTerminoViagem || new Date(),
      destinos: Array.isArray(travel.destinos)
        ? travel.destinos.map((destination) => ({
            ...destination,
            custos: destination.custos.map((custo) => {
              const valorAtual =
                custo.ValorCustoDestino?.$numberDecimal ||
                custo.ValorCustoDestino;

              return {
                ...custo,
                ValorCustoDestino:
                  valorAtual && !isNaN(valorAtual)
                    ? parseFloat(valorAtual)
                    : parseFloat(custo.ValorCustoDestino) || 0,
              };
            }),
          }))
        : [],
    };
    try {
      identifier
        ? await EditTravel(identifier, { ...updatedTravel })
        : await NewTravel({ ...updatedTravel });

      Swal.fire({
        title: "Tudo Certo!",
        text: identifier
          ? "A viagem foi atualizada com êxito."
          : "A viagem foi criada com êxito.",
        icon: "success",
        showCancelButton: false,
        confirmButtonText: "OK",
      });

      navigate("/viagens");
    } catch (error) {
      const message = error?.response?.data?.message || error.message;
      setErrorOnProcess(message);

      Swal.fire({
        title: "Ocorreu um Erro",
        text: message,
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "Fechar",
      });
    }

    setProcessing(false);
  }

  function addDestination() {
    const destination = {
      idUnidadeFederativa: null,
      idMunicipioDestino: null,
      DataDestinoViagem: new Date(),
      custos: [
        {
          idTipoCusto: 1,
          ValorCustoDestino: 0,
        },
        {
          idTipoCusto: 2,
          ValorCustoDestino: 0,
        },
        {
          idTipoCusto: 3,
          ValorCustoDestino: 0,
        },
        {
          idTipoCusto: 4,
          ValorCustoDestino: 0,
        },
      ],
    };
    setTravel((_) => ({ ..._, destinos: [..._.destinos, destination] }));

    setTimeout(() => {
      if (lastDestinationRef.current) {
        lastDestinationRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  }

  function removeDestination(index) {
    Swal.fire({
      title: "Remover Destino",
      text: `Tem certeza que deseja remover o destino nº ${index + 1}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Remover",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setTravel((prevTravel) => ({
          ...prevTravel,
          destinos: prevTravel.destinos.filter((_, i) => i !== index),
        }));
      }
    });
  }

  function updateDestination(index, field, value) {
    setTravel((prevTravel) => ({
      ...prevTravel,
      destinos: prevTravel.destinos.map((destination, i) =>
        i === index ? { ...destination, [field]: value } : destination
      ),
    }));
  }

  // Função para formatar os valores como moeda (R$)
  function formatCurrency(value) {
    if (!value) return "";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  // Atualização dos custos com formatação correta no input
  function updateCost(destinationIndex, idTipoCusto, newValue) {
    // Remove a formatação de moeda e converte para número para salvar corretamente
    const numericValue = parseFloat(newValue.replace(/\D/g, "")) / 100;

    setTravel((prevTravel) => ({
      ...prevTravel,
      destinos: prevTravel.destinos.map((destination, i) =>
        i === destinationIndex
          ? {
              ...destination,
              custos: destination.custos.map((custo) =>
                custo.idTipoCusto === idTipoCusto
                  ? { ...custo, ValorCustoDestino: numericValue }
                  : custo
              ),
            }
          : destination
      ),
    }));
  }

  return (
    <>
      <PageHeader title={identifier ? "Editar Viagem" : "Nova Viagem"}>
        <div className="row justify-content-end">
          <div className="col-auto">
            <button
              type="button"
              className="btn btn-primary"
              onClick={saveTravel}
              disabled={processing || importing}
            >
              {processing ? (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  aria-hidden="true"
                />
              ) : (
                <IconCheck stroke={1} />
              )}
              {processing
                ? identifier
                  ? "Salvando..."
                  : "Cadastrando..."
                : identifier
                ? "Salvar Alterações"
                : "Cadastrar"}
            </button>
          </div>
        </div>
      </PageHeader>

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
                      disabled={identifier}
                      value={travel.idEmpregado}
                      onChange={({ target }) =>
                        setTravel((_) => ({ ..._, idEmpregado: target.value }))
                      }
                    >
                      {importingUsers === false &&
                        travel.idEmpregado == null && (
                          <option
                            selected
                            disabled
                            label="Selecionar usuário..."
                          />
                        )}
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
                    disabled={importingFederativeUnits}
                    value={travel.unidadeFederativaId}
                    onChange={(e) =>
                      setTravel((_) => ({
                        ..._,
                        unidadeFederativaId: e.target.value,
                        idMunicipioSaida: null,
                      }))
                    }
                  >
                    {importingFederativeUnits === false &&
                      travel.unidadeFederativaId == null && (
                        <option
                          selected
                          disabled
                          label="Selecionar Unidade Federativa..."
                        />
                      )}
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
                    disabled={
                      travel.unidadeFederativaId == null || importingCities
                    }
                    value={travel.idMunicipioSaida}
                    onChange={(e) => {
                      setTravel((_) => ({
                        ..._,
                        idMunicipioSaida: e.target.value,
                      }));
                    }}
                  >
                    {importingCities === false &&
                      travel.idMunicipioSaida == null && (
                        <option
                          selected
                          disabled
                          label="Selecionar Cidade..."
                        />
                      )}
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
                    onChange={(DataInicioViagem) =>
                      setTravel((_) => ({ ..._, DataInicioViagem }))
                    }
                  />
                </div>

                <div className="col">
                  <label className="form-label required" htmlFor="nameInput">
                    Data Final:
                  </label>
                  <DateInput
                    value={travel?.DataTerminoViagem || new Date()}
                    onChange={(DataTerminoViagem) =>
                      setTravel((_) => ({ ..._, DataTerminoViagem }))
                    }
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
              updateDestination={updateDestination}
              updateCost={updateCost}
              removeDestination={removeDestination}
            />
          </div>
        </div>
      ))}

      <div className="row justify-content-center">
        <div className="col-auto">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={addDestination}
            disabled={travel.destinos.length >= 5}
          >
            <IconPlus className="icon" stroke={1} />
            Adicionar Destino{" "}
            {travel.destinos.length >= 5 && <small>( Limite Atingido )</small>}
          </button>
        </div>
      </div>
    </>
  );
}
