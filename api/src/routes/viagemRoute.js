import express from "express";
import {
  criarViagem,
  buscarViagemPeloId,
  buscarViagemPeloEmpregadoId,
  atualizarViagem,
  deletarViagem,
  exportarViagemToPdf,
} from "../controllers/ViagemController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @openapi
 * /viagens:
 *   post:
 *     summary: Registra uma nova viagem
 *     tags:
 *       - Viagem
 *     security:
 *       - BearerAuth: []  # Exige autenticação JWT para acessar essa rota
 *     operationId: criarViagem
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idEmpregado:
 *                 type: number
 *                 description: ID do empregado associado à viagem.
 *                 example: 1
 *               idMunicipioSaida:
 *                 type: number
 *                 description: ID do destino de saída.
 *                 example: 1
 *               DataInicioViagem:
 *                 type: string
 *                 format: date
 *                 description: Data de início da viagem.
 *                 example: "2024-01-01"
 *               DataTerminoViagem:
 *                 type: string
 *                 format: date
 *                 description: Data de término da viagem.
 *                 example: "2024-01-10"
 *               destinos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     idMunicipioDestino:
 *                       type: number
 *                       description: ID do município de destino.
 *                       example: 101
 *                     DataDestinoViagem:
 *                       type: string
 *                       format: date
 *                       description: Data de chegada no destino.
 *                       example: "2024-01-05"
 *                     custo:
 *                       type: object
 *                       properties:
 *                         idTipoCusto:
 *                           type: number
 *                           description: ID do tipo de custo.
 *                           example: 1
 *                         ValorCustoDestino:
 *                           type: number
 *                           format: float
 *                           description: Valor do custo associado ao destino.
 *                           example: 150.50
 *     responses:
 *       201:
 *         description: Viagem criada com sucesso.
 *       400:
 *         description: Solicitação inválida (Bad Request).
 *       500:
 *         description: Erro interno do servidor.
 */
router.post("/", verificarToken, criarViagem);

/**
 * @openapi
 * /viagens/{idViagem}:
 *   get:
 *     summary: Busca uma viagem pelo ID
 *     tags:
 *       - Viagem
 *     operationId: buscarViagemPeloId
 *     parameters:
 *       - name: idViagem
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *         description: O ID único da viagem.
 *     responses:
 *       200:
 *         description: Detalhes da viagem.
 *       404:
 *         description: Viagem não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get("/:idViagem", verificarToken, buscarViagemPeloId);

/**
 * @openapi
 * /viagens/empregado/{idEmpregado}:
 *   get:
 *     summary: Busca viagens por ID do empregado
 *     tags:
 *       - Viagem
 *     operationId: buscarViagemPeloEmpregadoId
 *     parameters:
 *       - name: idEmpregado
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *         description: O ID do empregado.
 *     responses:
 *       200:
 *         description: Lista de viagens associadas ao empregado.
 *       404:
 *         description: Nenhuma viagem encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get(
  "/empregado/:idEmpregado",
  verificarToken,
  buscarViagemPeloEmpregadoId
);

/**
 * @openapi
 * /viagens/{idViagem}:
 *   put:
 *     summary: Atualiza os detalhes de uma viagem pelo seu ID
 *     tags:
 *       - Viagem
 *     operationId: atualizarViagem
 *     security:
 *       - BearerAuth: []  # Exige autenticação JWT para acessar essa rota
 *     parameters:
 *       - name: idViagem
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *         description: O ID único da viagem.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idEmpregado:
 *                 type: number
 *                 description: ID do empregado associado à viagem.
 *                 example: 1001
 *               DataInicioViagem:
 *                 type: string
 *                 format: date
 *                 description: Data de início da viagem.
 *                 example: "2024-01-01"
 *               DataTerminoViagem:
 *                 type: string
 *                 format: date
 *                 description: Data de término da viagem.
 *                 example: "2024-01-10"
 *               destinos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     idDestinoViagem:
 *                       type: number
 *                       description: ID único do destino.
 *                       example: 1
 *                     idMunicipioDestino:
 *                       type: number
 *                       description: ID do município de destino.
 *                       example: 101
 *                     DataDestinoViagem:
 *                       type: string
 *                       format: date
 *                       description: Data de chegada no destino.
 *                       example: "2024-01-05"
 *                     custo:
 *                       type: object
 *                       properties:
 *                         idCustoDestino:
 *                           type: number
 *                           description: ID único do custo.
 *                           example: 1
 *                         idTipoCusto:
 *                           type: number
 *                           description: ID do tipo de custo.
 *                           example: 1
 *                         ValorCustoDestino:
 *                           type: number
 *                           format: float
 *                           description: Valor do custo associado ao destino.
 *                           example: 150.50
 *     responses:
 *       200:
 *         description: Viagem atualizada com sucesso.
 *       404:
 *         description: Viagem não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
router.put("/:idViagem", verificarToken, atualizarViagem);

/**
 * @openapi
 * /viagens/{idViagem}:
 *   delete:
 *     summary: Exclui uma viagem pelo seu ID
 *     tags:
 *       - Viagem
 *     operationId: deletarViagem
 *     security:
 *       - BearerAuth: []  # Exige autenticação JWT para acessar essa rota
 *     parameters:
 *       - name: idViagem
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *         description: O ID único da viagem.
 *     responses:
 *       200:
 *         description: Viagem excluída com sucesso.
 *       404:
 *         description: Viagem não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
router.delete("/:idViagem", verificarToken, deletarViagem);

/**
 * @openapi
 * /viagens/{idViagem}/exportar-pdf:
 *   get:
 *     summary: Exporta uma viagem e seus destinos para PDF
 *     tags:
 *       - Viagem
 *     operationId: exportarViagemToPdf
 *     security:
 *       - BearerAuth: []  # Exige autenticação JWT para acessar essa rota
 *     parameters:
 *       - name: idViagem
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *         description: O ID único da viagem.
 *     responses:
 *       200:
 *         description: PDF gerado com sucesso.
 *       404:
 *         description: Viagem não encontrada.
 *       500:
 *         description: Erro ao gerar PDF.
 */
router.get("/:idViagem/exportar-pdf", verificarToken, exportarViagemToPdf);

export default router;
