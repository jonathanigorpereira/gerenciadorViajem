import axios from 'axios';

/**
 * Cadastrar nova cidade.
 * @param {*} data Modelo.
 * @returns 
 */
export const NewCity = (data = {}) => axios.post('/municipios', data);

/**
 * Editar cidade.
 * @param {*} id Identificador da cidade.
 * @param {*} data Modelo.
 * @returns 
 */
export const EditCity = (id = 0, data = {}) => axios.put(`/municipios/${id}`, data);

/**
 * Excluir cidade.
 * @param {*} id Identificador da cidade.
 * @returns 
 */
export const DeleteCity = (id = 0) => axios.delete(`/municipios/${id}`);

/**
 * Obter uma cidade específica.
 * @param {*} id Identificador da cidade.
 * @returns 
 */
export const GetCity = (id = 0) => axios.get(`/municipios/${id}`);

/**
 * Obter todas as cidades cadastradas.
 * @returns 
 */
export const GetCities = (federativeUnitID = 1) => axios.get(`/municipios/unidade-federativa/${federativeUnitID}`);
