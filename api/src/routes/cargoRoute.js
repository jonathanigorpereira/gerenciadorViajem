import express from "express";
import { cadastrarCargo } from "../controllers/CargoController.js";

const router = express.Router();

/**
 * @openapi
 * /cargo/cadastrar:
 *   post:
 *     summary: Registra um novo cargo
 *     tags:
 *       - Cargo
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
router.post("/cargo/cadastrar", cadastrarCargo);

export default router;
