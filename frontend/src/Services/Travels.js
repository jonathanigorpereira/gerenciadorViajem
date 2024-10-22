import axios from "axios";

/**
 * Cadastrar novo viagem.
 * @param {*} data Modelo.
 * @returns
 */
export const NewTravel = (data = {}) => axios.post("/viagens", data);

/**
 * Editar viagem.
 * @param {*} id Identificador da viagem.
 * @param {*} data Modelo.
 * @returns
 */
export const EditTravel = (id = 0, data = {}) =>
  axios.put(`/viagens/${id}`, data);

/**
 * Excluir viagem.
 * @param {*} id Identificador da viagem.
 * @returns
 */
export const DeleteTravel = (id = 0) => axios.delete(`/viagens/${id}`);

/**
 * Obter uma viagem.
 * @param {*} id Identificador da viagem.
 * @returns
 */
export const GetTravel = (id = 0) => axios.get(`/viagens/${id}`);

/**
 * Obter todos as viajens cadastrados para um usuário.
 * @param {*} userID Identificador do usuário.
 * @returns
 */
export const GetTravels = (userID) => axios.get(`/viagens/empregado/${userID}`);

/**
 * Obter PDF da viajem.
 * @param {*} id Identificador da viagem.
 * @returns
 */
//export const GetTravelPDF = (id) => axios.get(`/viagens/${id}/exportar-pdf`);
export async function GetTravelPDF(idViagem, token) {
  try {
    const response = await axios.get(`/viagens/${idViagem}/exportar-pdf`, {
      responseType: "blob",
    });
    return response;
  } catch (error) {
    throw error;
  }
}

/**
 * Aprovar viagem.
 * @param {*} id Identificador da viagem.
 * @returns
 */
export const ApproveTravel = (id) => axios.put(`/viagens/${id}/aprovar`);

/**
 * Rejeitar viagem.
 * @param {*} id Identificador da viagem.
 * @returns
 */
export const RejectTravel = (id) => axios.put(`/viagens/${id}/reprovar`);
