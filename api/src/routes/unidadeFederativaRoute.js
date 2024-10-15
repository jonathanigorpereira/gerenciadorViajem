import express from "express";
import {
  cadastrarUnidadeFederativa,
  listarTodasUnidadesFederativas,
  obterUnidadeFederativaPorId,
  atualizarUnidadeFederativaExistente,
  deletarUnidadeFederativa,
} from "../controllers/unidadeFederativaController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @openapi
 * /unidades-federativas:
 *   post:
 *     summary: Registra uma nova Unidade Federativa
 *     tags:
 *       - Unidade Federativa
 *     security:
 *       - BearerAuth: []  # Exige autenticação JWT para acessar essa rota
 *     operationId: cadastrarUnidadeFederativa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               SiglaUnidadeFederativa:
 *                 type: string
 *                 description: A sigla da Unidade Federativa.
 *                 example: "SP"
 *               NomeUnidadeFederativa:
 *                 type: string
 *                 description: O nome completo da Unidade Federativa.
 *                 example: "São Paulo"
 *               ativo:
 *                 type: boolean
 *                 description: Status da Unidade Federativa (ativa ou inativa).
 *                 example: true
 *     responses:
 *       201:
 *         description: Unidade Federativa criada com sucesso.
 *       400:
 *         description: Solicitação inválida (Bad Request).
 *       500:
 *         description: Erro interno do servidor.
 */
router.post("/", verificarToken, cadastrarUnidadeFederativa);

/**
 * @openapi
 * /unidades-federativas:
 *   get:
 *     summary: Lista todas as Unidades Federativas
 *     tags:
 *       - Unidade Federativa
 *     security:
 *       - BearerAuth: []  # Exige autenticação JWT para acessar essa rota
 *     responses:
 *       200:
 *         description: Lista de todas as Unidades Federativas cadastradas.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get("/", verificarToken, listarTodasUnidadesFederativas);

/**
 * @openapi
 * /unidades-federativas/{idUnidadeFederativa}:
 *   get:
 *     summary: Busca uma Unidade Federativa pelo ID
 *     tags:
 *       - Unidade Federativa
 *     parameters:
 *       - name: idUnidadeFederativa
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *         description: O ID único da Unidade Federativa.
 *     responses:
 *       200:
 *         description: Detalhes da Unidade Federativa.
 *       404:
 *         description: Unidade Federativa não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get(
  "/:idUnidadeFederativa",
  verificarToken,
  obterUnidadeFederativaPorId
);

/**
 * @openapi
 * /unidades-federativas/{idUnidadeFederativa}:
 *   put:
 *     summary: Atualiza os detalhes de uma Unidade Federativa pelo seu ID
 *     tags:
 *       - Unidade Federativa
 *     security:
 *       - BearerAuth: []  # Exige autenticação JWT para acessar essa rota
 *     parameters:
 *       - name: idUnidadeFederativa
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *         description: O ID único da Unidade Federativa.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               SiglaUnidadeFederativa:
 *                 type: string
 *                 description: A sigla atualizada da Unidade Federativa.
 *                 example: "SP"
 *               NomeUnidadeFederativa:
 *                 type: string
 *                 description: O nome atualizado da Unidade Federativa.
 *                 example: "São Paulo"
 *               ativo:
 *                 type: boolean
 *                 description: Status da Unidade Federativa (ativa ou inativa).
 *                 example: true
 *     responses:
 *       200:
 *         description: Unidade Federativa atualizada com sucesso.
 *       404:
 *         description: Unidade Federativa não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
router.put(
  "/:idUnidadeFederativa",
  verificarToken,
  atualizarUnidadeFederativaExistente
);

/**
 * @openapi
 * /unidades-federativas/{idUnidadeFederativa}:
 *   delete:
 *     summary: Exclui uma Unidade Federativa pelo seu ID
 *     tags:
 *       - Unidade Federativa
 *     security:
 *       - BearerAuth: []  # Exige autenticação JWT para acessar essa rota
 *     parameters:
 *       - name: idUnidadeFederativa
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *         description: O ID único da Unidade Federativa.
 *     responses:
 *       200:
 *         description: Unidade Federativa excluída com sucesso.
 *       404:
 *         description: Unidade Federativa não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
router.delete(
  "/:idUnidadeFederativa",
  verificarToken,
  deletarUnidadeFederativa
);

export default router;
