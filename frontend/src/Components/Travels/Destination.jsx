import {
  IconBed,
  IconCar,
  IconPizza,
  IconPlaneArrival,
  IconTicket,
  IconTrash,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { GetFederativeUnits } from "../../Services/FederativeUnits";
import { GetCities } from "../../Services/Cities";
import { DateInput } from "../Forms/DateInput";

export default function TravelDestination({
  index,
  updateDestination,
  updateCost,
  removeDestination,
  isViewMode = false, // Adicionando a prop isViewMode para controlar o modo de visualização
  ...destino
}) {
  const [federativeUnits, setFederativeUnits] = useState([]);
  const [cities, setCities] = useState([]);

  const [importingFederativeUnits, setImportingFederativeUnits] =
    useState(false);
  const [importingCities, setImportingCities] = useState(false);

  useEffect(() => {
    getFederativeUnits();
  }, []);

  useEffect(() => {
    if (destino.idUnidadeFederativa) {
      getCities();
    }
  }, [destino.idUnidadeFederativa]);

  async function getFederativeUnits() {
    setImportingFederativeUnits(true);
    try {
      const result = await GetFederativeUnits();
      setFederativeUnits(result);
    } catch (error) {
      // Handle error
    }
    setImportingFederativeUnits(false);
  }

  async function getCities() {
    setImportingCities(true);
    try {
      const result = await GetCities(destino.idUnidadeFederativa);
      setCities(result);
    } catch (error) {
      // Handle error
    }
    setImportingCities(false);
  }

  // Função para formatar valores como moeda
  function formatCurrency(value) {
    if (isNaN(value) || value === null) return "";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  function extractDecimalValue(value) {
    if (value && typeof value === "object" && value.$numberDecimal) {
      return parseFloat(value.$numberDecimal);
    }
    return value;
  }

  return (
    <div className="card border-success">
      <div className="card-header">
        <div className="row align-items-center">
          <div className="col">
            <h6 className="card-title text-uppercase mb-0">
              <IconPlaneArrival className="me-2" size={36} stroke={1} />
              Destino {index + 1}
            </h6>
          </div>
          <div className="col">
            {/* Só exibe o botão de remover destino se não estiver no modo de visualização */}
            {!isViewMode && (
              <button
                type="button"
                className="btn btn-sm float-end px-2"
                onClick={() => removeDestination(index)}
              >
                <IconTrash className="icon" stroke={1} />
                Remover Destino
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="row mb-3">
          <div className="col-12 col-lg mb-3 mb-lg-0">
            <label className="form-label required">Unidade Federativa:</label>
            <select
              className="form-select"
              disabled={importingFederativeUnits || isViewMode} // Desabilitado no modo de visualização
              value={destino.idUnidadeFederativa}
              onChange={(e) => {
                updateDestination(index, "idUnidadeFederativa", e.target.value);
                updateDestination(index, "idMunicipioDestino", null);
              }}
            >
              {importingFederativeUnits == false &&
                destino.idUnidadeFederativa == null && (
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

          <div className="col-12 col-lg mb-3 mb-lg-0">
            <label className="form-label required">Cidade:</label>
            <select
              className="form-select"
              disabled={
                destino.idUnidadeFederativa == null ||
                importingCities ||
                isViewMode // Desabilitado no modo de visualização
              }
              value={destino.idMunicipioDestino}
              onChange={(e) =>
                updateDestination(index, "idMunicipioDestino", e.target.value)
              }
            >
              {importingCities == false &&
                destino.idMunicipioDestino == null && (
                  <option selected disabled label="Selecionar Cidade..." />
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

          <div className="col-12 col-lg-3">
            <label className="form-label required">Data:</label>
            <DateInput
              value={destino.DataDestinoViagem}
              onChange={(DataDestinoViagem) =>
                updateDestination(index, "DataDestinoViagem", DataDestinoViagem)
              }
              disabled={isViewMode} // Desabilitado no modo de visualização
            />
          </div>
        </div>

        <div className="row">
          <div className="col-12 mb-2">
            <h6 className="text-uppercase">Custos</h6>
          </div>
          <div className="col">
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td>
                    <IconTicket className="me-1" stroke={1} size={24} />
                    Passagem
                  </td>
                  <td style={{ width: "12rem" }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="R$ 0,00"
                      value={formatCurrency(
                        extractDecimalValue(
                          destino.custos?.find((_) => _.idTipoCusto == 1)
                            ?.ValorCustoDestino || 0
                        )
                      )}
                      onChange={(e) => updateCost(index, 1, e.target.value)}
                      disabled={isViewMode} // Desabilitado no modo de visualização
                    />
                  </td>
                </tr>

                <tr>
                  <td>
                    <IconPizza className="me-1" stroke={1} size={24} />
                    Alimentação
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="R$ 0,00"
                      value={formatCurrency(
                        extractDecimalValue(
                          destino.custos?.find((_) => _.idTipoCusto == 2)
                            ?.ValorCustoDestino || 0
                        )
                      )}
                      onChange={(e) => updateCost(index, 2, e.target.value)}
                      disabled={isViewMode} // Desabilitado no modo de visualização
                    />
                  </td>
                </tr>

                <tr>
                  <td>
                    <IconBed className="me-1" stroke={1} size={24} />
                    Hospedagem
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="R$ 0,00"
                      value={formatCurrency(
                        extractDecimalValue(
                          destino.custos?.find((_) => _.idTipoCusto == 3)
                            ?.ValorCustoDestino || 0
                        )
                      )}
                      onChange={(e) => updateCost(index, 3, e.target.value)}
                      disabled={isViewMode} // Desabilitado no modo de visualização
                    />
                  </td>
                </tr>

                <tr>
                  <td>
                    <IconCar className="me-1" stroke={1} size={24} />
                    Locomoção
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="R$ 0,00"
                      value={formatCurrency(
                        extractDecimalValue(
                          destino.custos?.find((_) => _.idTipoCusto == 4)
                            ?.ValorCustoDestino || 0
                        )
                      )}
                      onChange={(e) => updateCost(index, 4, e.target.value)}
                      disabled={isViewMode} // Desabilitado no modo de visualização
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
