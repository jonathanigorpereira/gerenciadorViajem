import { useContext, useEffect, useState } from "react";
import PageHeader from "../../Components/Header";
import { saveAs } from "file-saver";
import {
  IconChartPie,
  IconCheck,
  IconClipboardCheck,
  IconClock,
  IconPencil,
  IconPlaneTilt,
  IconPlus,
  IconTrack,
  IconTrash,
  IconUser,
  IconX,
  IconDownload,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { UserContext } from "../../Contexts/UserContext";
import {
  ApproveTravel,
  DeleteTravel,
  GetTravels,
  RejectTravel,
  GetTravelPDF,
} from "../../Services/Travels";
import { GetUsers } from "../../Services/Users";
import Spinner from "../../Components/Spinner";
import { ToDateWord } from "../../Utils/GenericFunctions";
import Sweetalert2 from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const Swal = withReactContent(Sweetalert2);

export default function Travels_IndexPage() {
  const actualUser = useContext(UserContext);
  const [isAdmin, setIsAdmin] = useState(false);

  const [travels, setTravels] = useState([]);
  const [users, setUsers] = useState([]);
  const [userID, setUserID] = useState(null);

  const [importingTravels, setImportingTravels] = useState(false);
  const [importingUsers, setImportingUsers] = useState(false);

  const [errorOnImportTravels, setErrorOnImportTravels] = useState();
  const [errorOnImportUsers, setErrorOnImportUsers] = useState();

  const TRAVEL_STATUS_COLOR = Object.freeze({
    Pendente: "bg-secondary",
    Aprovado: "bg-success",
    Reprovado: "bg-danger",
    "Status da viagem não encontrado": "bg-dark",
  });

  useEffect(() => {
    if (actualUser) {
      setIsAdmin(actualUser.cargo.idCargo === 1);
    }
  }, [actualUser]);

  useEffect(() => {
    if (actualUser && isAdmin) {
      getUsers();
    } else {
      setUserID(actualUser?.idEmpregado);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (userID) {
      getTravels();
    }
  }, [userID]);

  async function getTravels() {
    setImportingTravels(true);
    setErrorOnImportTravels(null);

    try {
      const result = await GetTravels(userID);
      setTravels(result.viagens);
    } catch (error) {
      setErrorOnImportTravels(error?.response?.data?.message || error.message);
    }

    setImportingTravels(false);
  }

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

  async function deleteTravel(id) {
    Swal.fire({
      title: "Excluir Viagem",
      text: `Tem certeza que deseja excluir essa viagem?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await DeleteTravel(id);
          Swal.fire(
            "Viagem Excluída",
            "A viagem foi excluída com êxito.",
            "success"
          );
          getTravels();
        } catch (error) {
          const message = error?.response?.data?.message || error.message;
          Swal.fire({
            title: "Ocorreu um Erro",
            text: message,
            icon: "error",
            showCancelButton: false,
            confirmButtonText: "Fechar",
          });
        }
      }
    });
  }

  async function approveTravel(id) {
    Swal.fire({
      title: "Aprovar Viagem",
      text: `Tem certeza que deseja aprovar essa viagem?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await ApproveTravel(id);
          Swal.fire(
            "Viagem Aprovada",
            "A viagem foi aprovada com êxito.",
            "success"
          );
          getTravels();
        } catch (error) {
          const message = error?.response?.data?.message || error.message;
          Swal.fire({
            title: "Ocorreu um Erro",
            text: message,
            icon: "error",
            showCancelButton: false,
            confirmButtonText: "Fechar",
          });
        }
      }
    });
  }

  async function rejectTravel(id) {
    Swal.fire({
      title: "Rejeitar Viagem",
      text: `Tem certeza que deseja rejeitar essa viagem?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await RejectTravel(id);
          Swal.fire(
            "Viagem Aprovada",
            "A viagem foi rejeitada com êxito.",
            "success"
          );
          getTravels();
        } catch (error) {
          const message = error?.response?.data?.message || error.message;
          Swal.fire({
            title: "Ocorreu um Erro",
            text: message,
            icon: "error",
            showCancelButton: false,
            confirmButtonText: "Fechar",
          });
        }
      }
    });
  }

  async function downloadTravelDocument(idViagem) {
    try {
      const token = localStorage.getItem("authorization");

      const response = await GetTravelPDF(idViagem, token);

      saveAs(response, `viagem_${idViagem}.pdf`);
    } catch (error) {
      console.error("Erro ao baixar o PDF:", error);
      Swal.fire({
        title: "Erro",
        text: error.message || "Ocorreu um erro ao tentar realizar o download.",
        icon: "error",
        confirmButtonText: "Fechar",
      });
    }
  }

  return (
    <>
      <PageHeader title="Viagens" titleRow>
        <div className="row justify-content-end">
          {actualUser?.cargo?.idCargo === 1 && (
            <div className="col col-lg-5">
              <div className="input-group flex-nowrap">
                <span className="input-group-text" id="addon-wrapping">
                  <IconUser stroke={1} size={26} />
                </span>
                <select
                  className="form-select"
                  value={userID}
                  onChange={({ target }) => setUserID(target.value)}
                >
                  {importingUsers == false && userID == null && (
                    <option selected disabled label="Selecionar usuário..." />
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

          <div className="col-auto">
            <Link className="btn btn-primary" to={"/viagens/novo"}>
              <IconPlus stroke={1} />
              Nova Viagem
            </Link>
          </div>
        </div>
      </PageHeader>

      {/* DASHBOARD */}

      <div className="row">
        {/* Totais */}
        <div className="col-lg-3 col-md-6">
          <div className="card text-white bg-primary mb-3">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <IconChartPie size={56} className="me-3" />
                <div>
                  <h5 className="card-title mb-0">Total</h5>
                  <p className="card-text fs-4">{travels.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pendentes */}
        <div className="col-lg-3 col-md-6">
          <div className="card text-white bg-secondary mb-3">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <IconClock size={56} className="me-3" />
                <div>
                  <h5 className="card-title mb-0">Pendentes</h5>
                  <p className="card-text fs-4">
                    {
                      travels.filter((_) => _.NomeStatusViagem === "Pendente")
                        .length
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Aprovadas */}
        <div className="col-lg-3 col-md-6">
          <div className="card text-white bg-success mb-3">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <IconCheck size={56} className="me-3" />
                <div>
                  <h5 className="card-title mb-0">Aprovadas</h5>
                  <p className="card-text fs-4">
                    {
                      travels.filter((_) => _.NomeStatusViagem === "Aprovado")
                        .length
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rejeitadas */}
        <div className="col-lg-3 col-md-6">
          <div className="card text-white bg-danger mb-3">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <IconX size={56} className="me-3" />
                <div>
                  <h5 className="card-title mb-0">Rejeitadas</h5>
                  <p className="card-text fs-4">
                    {
                      travels.filter((_) => _.NomeStatusViagem === "Reprovado")
                        .length
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LISTAGEM */}
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-body">
              {userID == null && isAdmin ? (
                <>
                  <p className="mb-0">
                    Selecione um usuário para importar suas viagens...
                  </p>
                </>
              ) : importingTravels ? (
                <Spinner />
              ) : errorOnImportTravels ? (
                <>
                  <h6 className="mb-0">Erro:</h6>
                  <p className="mb-0">{errorOnImportTravels}</p>
                </>
              ) : travels.length === 0 ? (
                <>
                  <p className="mb-0">Nenhuma viagem disponível.</p>
                </>
              ) : (
                <div className="table-responsive-lg">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="small text-muted text-uppercase"
                        >
                          Origem
                        </th>
                        <th
                          scope="col"
                          className="small text-muted text-uppercase text-center"
                        >
                          Nº Destinos
                        </th>
                        <th
                          scope="col"
                          className="small text-muted text-uppercase text-center"
                        >
                          Data Inicio
                        </th>
                        <th
                          scope="col"
                          className="small text-muted text-uppercase text-center"
                        >
                          Data Final
                        </th>
                        <th
                          scope="col"
                          className="small text-muted text-uppercase text-center"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="small text-muted text-uppercase text-center"
                        >
                          Documento
                        </th>
                        <th scope="col" />
                      </tr>
                    </thead>
                    <tbody>
                      {travels.map((travel) => (
                        <tr key={travel.idViagem} travel-id={travel.idViagem}>
                          {/* Origem */}
                          <td>
                            <div className="d-flex align-items-center">
                              <IconPlaneTilt stroke={1} size={38} />
                              <div className="position-relative d-flex flex-column ms-2">
                                <span className="d-inline-block">
                                  {travel.municipioSaida.NomeMunicipioSaida}
                                </span>
                                <small className="text-muted">
                                  {
                                    travel.municipioSaida
                                      .NomeUnidadeFederativaSaida
                                  }
                                </small>
                              </div>
                            </div>
                          </td>

                          {/* Destinos */}
                          <td className="text-center">
                            {travel.destinos.length}
                          </td>

                          {/* Data Início */}
                          <td className="text-center">
                            {ToDateWord(travel.DataInicioViagem)}
                          </td>

                          {/* Data Final */}
                          <td className="text-center">
                            {ToDateWord(travel.DataTerminoViagem)}
                          </td>

                          {/* Status */}
                          <td className="text-center">
                            <span
                              className={`badge rounded-pill ${
                                TRAVEL_STATUS_COLOR[travel.NomeStatusViagem]
                              }`}
                            >
                              {travel.NomeStatusViagem}
                            </span>
                          </td>

                          {/* Documento */}
                          <td className="text-center">
                            {travel?.NomeStatusViagem === "Aprovado" ? (
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() =>
                                  downloadTravelDocument(travel.idViagem)
                                }
                              >
                                <IconDownload size={17} className="me-1" />
                                Baixar PDF
                              </button>
                            ) : travel?.NomeStatusViagem === "Pendente" ? (
                              <span
                                className="badge rounded-pill bg-warning"
                                title="O documento será gerado após aprovação."
                              >
                                <i className="fa-clock"></i> Aguardando
                                aprovação
                              </span>
                            ) : travel?.NomeStatusViagem === "Reprovado" ? (
                              <span
                                className="badge rounded-pill bg-danger"
                                title="Documnto de viagem indisponível, pois a solicitação foi reprovada."
                              >
                                <i className="fa-ban"></i> Recusado
                              </span>
                            ) : (
                              <span
                                className="badge rounded-pill bg-secondary"
                                title="Documento de viagem não disponível."
                              >
                                <i className="fa-exclamation-circle"></i>{" "}
                                Indisponível
                              </span>
                            )}
                          </td>

                          {/* Opções */}

                          <td className="text-end">
                            <div class="dropdown">
                              <button
                                class="btn btn-sm dropdown-toggle px-3"
                                type="button"
                                data-bs-toggle="dropdown"
                              />
                              <ul class="dropdown-menu dropdown-menu-end">
                                <li>
                                  <h5 className=" dropdown-header">Viagem</h5>
                                </li>
                                {/* Visualizar - Sempre disponível */}
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={`/viagens/visualizar/${travel.idViagem}`}
                                  >
                                    <IconPencil
                                      className="icon me-2"
                                      stroke={1}
                                      size={18}
                                      style={{ marginTop: "-4px" }}
                                    />
                                    Visualizar
                                  </Link>
                                </li>
                                {travel.NomeStatusViagem === "Pendente" && (
                                  <li>
                                    <Link
                                      class="dropdown-item"
                                      to={`/viagens/editar/${travel.idViagem}`}
                                    >
                                      <IconPencil
                                        className="icon me-2"
                                        stroke={1}
                                        size={18}
                                        style={{ marginTop: "-4px" }}
                                      />
                                      Editar
                                    </Link>
                                  </li>
                                )}
                                {isAdmin &&
                                  travel.NomeStatusViagem !== "Aprovado" &&
                                  travel.NomeStatusViagem !== "Reprovado" && (
                                    <>
                                      <li>
                                        <a
                                          class="dropdown-item"
                                          onClick={() =>
                                            deleteTravel(travel.idViagem)
                                          }
                                        >
                                          <IconTrash
                                            className="icon me-2"
                                            stroke={1}
                                            size={18}
                                            style={{ marginTop: "-4px" }}
                                          />
                                          Excluir
                                        </a>
                                      </li>

                                      <li>
                                        <div className=" dropdown-divider" />
                                        <h5 className=" dropdown-header">
                                          Aprovação
                                        </h5>
                                        <li>
                                          <a
                                            class="dropdown-item"
                                            onClick={() =>
                                              approveTravel(travel.idViagem)
                                            }
                                          >
                                            <IconCheck
                                              className="icon me-2"
                                              stroke={1}
                                              size={18}
                                              style={{ marginTop: "-4px" }}
                                            />
                                            Aprovar
                                          </a>
                                          <a
                                            class="dropdown-item"
                                            onClick={() =>
                                              rejectTravel(travel.idViagem)
                                            }
                                          >
                                            <IconX
                                              className="icon me-2"
                                              stroke={1}
                                              size={18}
                                              style={{ marginTop: "-4px" }}
                                            />
                                            Rejeitar
                                          </a>
                                        </li>
                                      </li>
                                    </>
                                  )}
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
