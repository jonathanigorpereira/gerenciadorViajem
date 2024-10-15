import express from "express";
import {
  atualizarMunicipio,
  deletarMunicipio,
  buscarMunicipioPeloId,
  buscarMunicipioPeloIdUnidadeFederativa,
  buscarTodosMunicipios,
  cirarMunicipio,
} from "../controllers/MunicipioController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @openapi
 * /municipios:
 *   post:
 *     summary: Registra um novo Município
 *     tags:
 *       - Município
 *     security:
 *       - BearerAuth: []  # Exige autenticação JWT para acessar essa rota
 *     operationId: createMunicipio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               NomeMunicipio:
 *                 type: string
 *                 description: O nome do município.
 *                 example: "São Paulo"
 *               idUnidadeFederativa:
 *                 type: number
 *                 description: ID da Unidade Federativa associada.
 *                 example: 35
 *               ativo:
 *                 type: boolean
 *                 description: Status do município (ativo ou inativo).
 *                 example: true
 *     responses:
 *       201:
 *         description: Município criado com sucesso.
 *       400:
 *         description: Solicitação inválida (Bad Request).
 *       500:
 *         description: Erro interno do servidor.
 */
router.post("/", verificarToken, cirarMunicipio);

/**
 * @openapi
 * /municipios:
 *   get:
 *     summary: Lista todos os Municípios
 *     tags:
 *       - Município
 *     security:
 *       - BearerAuth: []  # Exige autenticação JWT para acessar essa rota
 *     responses:
 *       200:
 *         description: Lista de todos os Municípios cadastrados.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get("/", verificarToken, buscarTodosMunicipios);

/**
 * @openapi
 * /municipios/{idMunicipio}:
 *   get:
 *     summary: Busca um Município pelo ID
 *     tags:
 *       - Município
 *     parameters:
 *       - name: idMunicipio
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *         description: O ID único do município.
 *     responses:
 *       200:
 *         description: Detalhes do município.
 *       404:
 *         description: Município não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get("/:idMunicipio", verificarToken, buscarMunicipioPeloId);

/**
 * @openapi
 * /municipios/unidade-federativa/{idUnidadeFederativa}:
 *   get:
 *     summary: Busca um Município pelo ID
 *     tags:
 *       - Município
 *     parameters:
 *       - name: idUnidadeFederativa
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *         description: O ID único da unidade federativa.
 *     responses:
 *       200:
 *         description: Detalhes do município.
 *       404:
 *         description: Município não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get(
  "/unidade-federativa/:idUnidadeFederativa",
  buscarMunicipioPeloIdUnidadeFederativa
);

/**
 * @openapi
 * /municipios/{idMunicipio}:
 *   put:
 *     summary: Atualiza os detalhes de um Município pelo seu ID
 *     tags:
 *       - Município
 *     security:
 *       - BearerAuth: []  # Exige autenticação JWT para acessar essa rota
 *     parameters:
 *       - name: idMunicipio
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *         description: O ID único do município.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               NomeMunicipio:
 *                 type: string
 *                 description: O nome atualizado do município.
 *                 example: "São Paulo"
 *               idUnidadeFederativa:
 *                 type: number
 *                 description: ID atualizado da Unidade Federativa associada.
 *                 example: 35
 *               ativo:
 *                 type: boolean
 *                 description: Status do município (ativo ou inativo).
 *                 example: true
 *     responses:
 *       200:
 *         description: Município atualizado com sucesso.
 *       404:
 *         description: Município não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.put("/:idMunicipio", verificarToken, atualizarMunicipio);

/**
 * @openapi
 * /municipios/{idMunicipio}:
 *   delete:
 *     summary: Exclui um Município pelo seu ID
 *     tags:
 *       - Município
 *     security:
 *       - BearerAuth: []  # Exige autenticação JWT para acessar essa rota
 *     parameters:
 *       - name: idMunicipio
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *         description: O ID único do município.
 *     responses:
 *       200:
 *         description: Município excluído com sucesso.
 *       404:
 *         description: Município não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.delete("/:idMunicipio", verificarToken, deletarMunicipio);

export default router;
