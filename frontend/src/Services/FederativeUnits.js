import axios from 'axios';

/**
 * Cadastrar nova unidade federativa.
 * @param {*} data Modelo.
 * @returns 
 */
export const NewFederativeUnit = (data = {}) => axios.post('/unidades-federativas', data);

/**
 * Editar unidade federativa.
 * @param {*} id Identificador da unidade.
 * @param {*} data Modelo.
 * @returns 
 */
export const EditFederativeUnit = (id = 0, data = {}) => axios.put(`/unidades-federativas/${id}`, data);

/**
 * Excluir unidade federativa.
 * @param {*} id Identificador da unidade.
 * @returns 
 */
export const DeleteFederativeUnit = (id = 0) => axios.delete(`/unidades-federativas/${id}`);

/**
 * Obter uma unidade federativa específica.
 * @param {*} id Identificador da unidade.
 * @returns 
 */
export const GetFederativeUnit = (id = 0) => axios.get(`/unidades-federativas/${id}`);

/**
 * Obter todas as unidades federativas cadastradas.
 * @returns 
 */
export const GetFederativeUnits = () => axios.get('/unidades-federativas');
