import express from "express";
import {
  cadastrarCargo,
  listarTodosCargos,
  obterCargoPorId,
  atualizarCargoExistente,
  deletarCargo,
} from "../controllers/CargoController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @openapi
 * /cargos:
 *   post:
 *     summary: Registra um novo cargo
 *     tags:
 *       - Cargo
 *     security:
 *       - BearerAuth: []  # Exige autenticação JWT para acessar essa rota
 *     operationId: cadastrarCargo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomeCargo:
 *                 type: string
 *                 description: O nome do cargo.
 *                 example: "Desenvolvedor"
 *               ativo:
 *                 type: boolean
 *                 description: Status do cargo (ativo ou inativo).
 *                 example: true
 *     responses:
 *       201:
 *         description: Cargo criado com sucesso.
 *       400:
 *         description: Solicitação inválida (Bad Request).
 *       500:
 *         description: Erro interno do servidor.
 */
router.post("/", verificarToken, cadastrarCargo);

/**
 * @openapi
 * /cargos:
 *   get:
 *     summary: Lista todos os cargos
 *     tags:
 *       - Cargo
 *     security:
 *       - BearerAuth: []  # Exige autenticação JWT para acessar essa rota
 *     responses:
 *       200:
 *         description: Lista de todos os cargos cadastrados.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get("/", verificarToken, listarTodosCargos);

/**
 * @openapi
 * /cargos/{idCargo}:
 *   get:
 *     summary: Busca um cargo pelo ID
 *     tags:
 *       - Cargo
 *     parameters:
 *       - name: idCargo
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *         description: O ID único do cargo.
 *     responses:
 *       200:
 *         description: Detalhes do cargo.
 *       404:
 *         description: Cargo não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get("/:idCargo", verificarToken, obterCargoPorId);

/**
 * @openapi
 * /cargos/{idCargo}:
 *   put:
 *     summary: Atualiza os detalhes de um cargo pelo seu ID
 *     tags:
 *       - Cargo
 *     security:
 *       - BearerAuth: []  # Exige autenticação JWT para acessar essa rota
 *     parameters:
 *       - name: idCargo
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *         description: O ID único do cargo.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomeCargo:
 *                 type: string
 *                 description: O nome atualizado do cargo.
 *                 example: "Gerente de TI"
 *               ativo:
 *                 type: boolean
 *                 description: Status do cargo (ativo ou inativo).
 *                 example: true
 *     responses:
 *       200:
 *         description: Cargo atualizado com sucesso.
 *       404:
 *         description: Cargo não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.put("/:idCargo", verificarToken, atualizarCargoExistente);

/**
 * @openapi
 * /cargos/{idCargo}:
 *   delete:
 *     summary: Exclui um cargo pelo seu ID
 *     tags:
 *       - Cargo
 *     security:
 *       - BearerAuth: []  # Exige autenticação JWT para acessar essa rota
 *     parameters:
 *       - name: idCargo
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *         description: O ID único do cargo.
 *     responses:
 *       200:
 *         description: Cargo excluído com sucesso.
 *       404:
 *         description: Cargo não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.delete("/:idCargo", verificarToken, deletarCargo);

export default router;
