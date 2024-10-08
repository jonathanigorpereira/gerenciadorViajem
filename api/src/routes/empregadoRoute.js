import express from "express";
import {
  cadastrarEmpregado,
  getEmpregadosComCargos,
  getEmpregadoPorId,
  updateEmpregado,
  deleteEmpregado,
} from "../controllers/EmpregadoController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @openapi
 * /empregado/listar:
 *   get:
 *     summary: Lista todos os empregados cadastrados com seus respectivos cargos
 *     tags:
 *       - Empregado
 *     operationId: listarEmpregados
 *     responses:
 *       200:
 *         description: Lista de todos os empregados e seus respectivos cargos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Empregado'
 *                 type: object
 *                 properties:
 *                   idEmpregado:
 *                     type: number
 *                     description: ID único do empregado.
 *                     example: 1
 *                   nomeEmpregado:
 *                     type: string
 *                     description: Nome do empregado.
 *                     example: "João Silva"
 *                   email:
 *                     type: string
 *                     description: E-mail do empregado.
 *                     example: "joao.silva@empresa.com"
 *                   ativo:
 *                     type: boolean
 *                     description: Status do empregado (ativo ou inativo).
 *                     example: true
 *                   cargo:
 *                     type: string
 *                     description: Nome do cargo do empregado.
 *                     example: "Desenvolvedor"
 *       500:
 *         description: Erro interno do servidor.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Empregado:
 *       type: object
 *       required:
 *         - nomeEmpregado
 *         - email
 *         - senha
 *         - idCargo
 *       properties:
 *         idEmpregado:
 *           type: integer
 *           example: 1
 *         nomeEmpregado:
 *           type: string
 *           required: true
 *           maxlength: 80
 *           example: "João Silva"
 *         email:
 *           type: string
 *           required: true
 *           maxlength: 80
 *           example: "joao.silva@example.com"
 *         senha:
 *           type: string
 *           required: true
 *           maxlength: 100
 *           example: "senhaSegura123"
 *         idCargo:
 *           type: integer
 *           required: true
 *           example: 2
 *         ativo:
 *           type: boolean
 *           default: true
 *           example: true
 */
router.get("/listar", verificarToken, getEmpregadosComCargos);

/**
 * @openapi
 * /empregado/{idEmpregado}:
 *   get:
 *     summary: Busca um empregado pelo ID com seus respectivos cargos
 *     tags:
 *       - Empregado
 *     operationId: buscarEmpregadoPorId
 *     parameters:
 *       - name: idEmpregado
 *         in: path
 *         required: true
 *         description: ID único do empregado.
 *         schema:
 *           type: number
 *           example: 1
 *     responses:
 *       200:
 *         description: Detalhes do empregado e seu respectivo cargo.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idEmpregado:
 *                   type: number
 *                   description: ID único do empregado.
 *                   example: 1
 *                 nomeEmpregado:
 *                   type: string
 *                   description: Nome do empregado.
 *                   example: "João Silva"
 *                 email:
 *                   type: string
 *                   description: E-mail do empregado.
 *                   example: "joao.silva@empresa.com"
 *                 ativo:
 *                   type: boolean
 *                   description: Status do empregado (ativo ou inativo).
 *                   example: true
 *                 cargo:
 *                   type: object
 *                   description: Detalhes do cargo associado ao empregado.
 *                   properties:
 *                     idCargo:
 *                       type: number
 *                       description: ID único do cargo.
 *                       example: 2
 *                     nomeCargo:
 *                       type: string
 *                       description: Nome do cargo associado.
 *                       example: "Desenvolvedor"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Data de criação do empregado.
 *                   example: "2023-09-29T12:34:56.789Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Data da última atualização do empregado.
 *                   example: "2023-09-30T12:34:56.789Z"
 *       404:
 *         description: Empregado não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get("/:idEmpregado", verificarToken, getEmpregadoPorId);

/**
 * @openapi
 * /empregado/cadastrar:
 *   post:
 *     summary: Registra um novo empregado
 *     tags:
 *       - Empregado
 *     operationId: cadastrarEmpregado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomeEmpregado:
 *                 type: string
 *                 description: O nome do empregado.
 *                 example: "João Silva"
 *               email:
 *                type: string
 *                description: E-mail do empregado.
 *                example: "joao.silva@empresa.com"
 *               senha:
 *                 type: string
 *                 description: A senha do empregado.
 *                 example: "senhaSegura123"
 *               idCargo:
 *                 type: number
 *                 description: O ID do cargo associado ao empregado.
 *                 example: 1
 *               ativo:
 *                 type: boolean
 *                 description: Status do empregado (ativo ou inativo).
 *                 example: true
 *     responses:
 *       201:
 *         description: Empregado criado com sucesso.
 *       400:
 *         description: Solicitação inválida (Bad Request).
 *       404:
 *         description: Cargo não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post("/cadastrar", verificarToken, cadastrarEmpregado);

/**
 * @openapi
 * /empregado/{idEmpregado}:
 *   put:
 *     summary: Atualiza os detalhes de um empregado pelo seu ID.
 *     tags:
 *       - Empregado
 *     operationId: atualizarEmpregado
 *     parameters:
 *       - name: idEmpregado
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *         description: O ID único do empregado.
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomeEmpregado:
 *                 type: string
 *                 description: O novo nome do empregado.
 *                 example: "João Silva Atualizado"
 *               email:
 *                 type: string
 *                 description: O novo e-mail do empregado.
 *                 example: "joao.atualizado@empresa.com"
 *               ativo:
 *                 type: boolean
 *                 description: Status atualizado do empregado (ativo ou inativo).
 *                 example: true
 *               idCargo:
 *                 type: Number
 *                 description: id do cargo.
 *                 example: 1
 *     responses:
 *       200:
 *         description: Detalhes do empregado atualizado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idEmpregado:
 *                   type: number
 *                   description: O ID único do empregado.
 *                   example: 1
 *                 nomeEmpregado:
 *                   type: string
 *                   description: Nome atualizado do empregado.
 *                   example: "João Silva Atualizado"
 *                 email:
 *                   type: string
 *                   description: E-mail atualizado do empregado.
 *                   example: "joao.atualizado@empresa.com"
 *                 ativo:
 *                   type: boolean
 *                   description: Status do empregado.
 *                   example: true
 *                 cargo:
 *                   type: object
 *                   description: Detalhes do cargo associado ao empregado.
 *                   properties:
 *                     idCargo:
 *                       type: number
 *                       description: ID do cargo associado.
 *                       example: 1
 *                     nomeCargo:
 *                       type: string
 *                       description: Nome do cargo.
 *                       example: "Desenvolvedor"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Data de criação do empregado.
 *                   example: "2023-09-20T15:20:30Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Data de atualização do empregado.
 *                   example: "2023-09-21T10:10:00Z"
 *       404:
 *         description: Empregado não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.put("/:idEmpregado", verificarToken, updateEmpregado);

/**
 * @openapi
 * /empregado/{idEmpregado}:
 *   delete:
 *     summary: Exclui um empregado pelo seu ID.
 *     tags:
 *       - Empregado
 *     operationId: excluirEmpregado
 *     parameters:
 *       - name: idEmpregado
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *         description: O ID único do empregado.
 *         example: 1
 *     responses:
 *       200:
 *         description: Mensagem de sucesso confirmando a exclusão.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso.
 *                   example: "Empregado excluído com sucesso"
 *       404:
 *         description: Empregado não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.delete("/:idEmpregado", verificarToken, deleteEmpregado);

export default router;
