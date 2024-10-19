import express from "express";
import {
  criarViagem,
  buscarViagemPeloId,
  buscarViagemPeloEmpregadoId,
  atualizarViagem,
  deletarViagem,
  exportarViagemToPdf,
  aprovarViagem,
  reprovarViagem,
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
 *                 description: ID do usuário associado à viagem.
 *                 example: 1
 *               idUnidadeFederativa:
 *                 type: number
 *                 description: ID da unidade federativa de saída.
 *                 example: 1
 *               idMunicipioSaida:
 *                 type: number
 *                 description: ID do município de saída.
 *                 example: 1
 *               idStatusViagem:
 *                 type: number
 *                 description: Status da viagem.
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
 *                     idUnidadeFederativa:
 *                       type: number
 *                       description: ID da unidade federativa do destino.
 *                       example: 1
 *                     idMunicipioDestino:
 *                       type: number
 *                       description: ID do município de destino.
 *                       example: 1
 *                     DataDestinoViagem:
 *                       type: string
 *                       format: date
 *                       description: Data de chegada no destino.
 *                       example: "2024-01-05"
 *                     custos:
 *                       type: array
 *                       description: Lista de custos associados ao destino.
 *                       items:
 *                         type: object
 *                         properties:
 *                           idTipoCusto:
 *                             type: number
 *                             description: ID do custo.
 *                             example: 1
 *                           ValorCustoDestino:
 *                             type: number
 *                             format: float
 *                             description: Valor do custo associado ao destino.
 *                             example: 150.50
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
 *                 example: 1
 *               idUnidadeFederativa:
 *                 type: number
 *                 description: ID da unidade federativa da viagem.
 *                 example: 1
 *               idMunicipioSaida:
 *                 type: number
 *                 description: ID do município de saída.
 *                 example: 1
 *               idStatusViagem:
 *                 type: number
 *                 description: ID do status da viagem.
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
 *                     idUnidadeFederativa:
 *                       type: number
 *                       description: ID da unidade federativa do destino.
 *                       example: 1
 *                     idMunicipioDestino:
 *                       type: number
 *                       description: ID do município de destino.
 *                       example: 1
 *                     DataDestinoViagem:
 *                       type: string
 *                       format: date
 *                       description: Data de chegada no destino.
 *                       example: "2024-01-05"
 *                     custos:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           idTipoCusto:
 *                             type: number
 *                             description: ID do tipo de custo.
 *                             example: 1
 *                           ValorCustoDestino:
 *                             type: number
 *                             format: float
 *                             description: Valor do custo associado ao destino.
 *                             example: 150.5
 *     responses:
 *       200:
 *         description: Viagem atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idViagem:
 *                   type: number
 *                   description: O ID da viagem.
 *                   example: 21
 *                 idEmpregado:
 *                   type: number
 *                   description: O ID do empregado associado à viagem.
 *                   example: 1
 *                 idUnidadeFederativa:
 *                   type: number
 *                   description: O ID da unidade federativa da viagem.
 *                   example: 1
 *                 idMunicipioSaida:
 *                   type: number
 *                   description: O ID do município de saída.
 *                   example: 1
 *                 idStatusViagem:
 *                   type: number
 *                   description: O ID do status da viagem.
 *                   example: 1
 *                 DataInicioViagem:
 *                   type: string
 *                   format: date
 *                   description: Data de início da viagem.
 *                   example: "2024-01-01"
 *                 DataTerminoViagem:
 *                   type: string
 *                   format: date
 *                   description: Data de término da viagem.
 *                   example: "2024-01-10"
 *                 destinos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       idUnidadeFederativa:
 *                         type: number
 *                         example: 1
 *                       idMunicipioDestino:
 *                         type: number
 *                         example: 1
 *                       DataDestinoViagem:
 *                         type: string
 *                         format: date
 *                         example: "2024-01-05"
 *                       custos:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             idTipoCusto:
 *                               type: number
 *                               example: 1
 *                             ValorCustoDestino:
 *                               type: number
 *                               format: float
 *                               example: 150.5
 *       404:
 *         description: Viagem não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
router.put("/:idViagem", verificarToken, atualizarViagem);

/**
 * @openapi
 * /viagens/{idViagem}/aprovar:
 *   put:
 *     summary: Aprova uma viagem pelo seu ID
 *     tags:
 *       - Viagem
 *     operationId: aprovarViagem
 *     security:
 *       - BearerAuth: []  # Exige autenticação JWT para acessar essa rota
 *     parameters:
 *       - in: path
 *         name: idViagem
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID único da viagem a ser aprovada.
 *     responses:
 *       200:
 *         description: Viagem aprovada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Viagem aprovada com sucesso!"
 *       403:
 *         description: Operação não autorizada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Apenas empregados com cargo 1 podem aprovar viagens."
 *       404:
 *         description: Viagem não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Viagem não encontrada."
 *       500:
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao aprovar viagem."
 */
router.put("/:idViagem/aprovar", verificarToken, aprovarViagem);

/**
 * @openapi
 * /viagens/{idViagem}/reprovar:
 *   put:
 *     summary: Reprova uma viagem pelo seu ID
 *     tags:
 *       - Viagem
 *     operationId: reprovarViagem
 *     security:
 *       - BearerAuth: []  # Exige autenticação JWT para acessar essa rota
 *     parameters:
 *       - in: path
 *         name: idViagem
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID único da viagem a ser reprovada.
 *     responses:
 *       200:
 *         description: Viagem reprovada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Viagem reprovada com sucesso!"
 *       403:
 *         description: Operação não autorizada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Apenas administradores podem reprovar viagens."
 *       404:
 *         description: Viagem não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Viagem não encontrada."
 *       500:
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao reprovar viagem."
 */
router.put("/:idViagem/reprovar", verificarToken, reprovarViagem);

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
