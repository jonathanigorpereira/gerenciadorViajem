import express from "express";
import passport from "passport";
import { login, logout } from "../controllers/authController.js"; // Controladores de login e logout usando JWT

const router = express.Router();

/**
 * @openapi
 * /auth/google:
 *   get:
 *     summary: Inicia o processo de autenticação com o Google OAuth.
 *     tags:
 *       - Autenticação
 *     description: Redireciona o usuário para o Google para autenticação OAuth.
 *     responses:
 *       302:
 *         description: Redireciona para o Google para autenticação.
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

/**
 * @openapi
 * /auth/google/callback:
 *   get:
 *     summary: Callback para o Google OAuth.
 *     tags:
 *       - Autenticação
 *     description: Callback que o Google OAuth redireciona após o processo de autenticação.
 *     responses:
 *       302:
 *         description: Redireciona para a rota de sucesso ou falha após a autenticação do Google.
 */
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/api/v1/auth/failure" }),
  (req, res) => {
    // Redireciona para o dashboard após autenticação bem-sucedida
    res.redirect(`http://localhost:3000/dashboard`);
  }
);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Realiza o login de um usuário utilizando e-mail e senha.
 *     tags:
 *       - Autenticação
 *     description: Autentica um usuário através de e-mail e senha, retornando um token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 description: E-mail do usuário
 *                 example: "joao@exemplo.com"
 *               senha:
 *                 type: string
 *                 description: Senha do usuário
 *                 example: "minhasenha123"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login realizado com sucesso"
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticação
 *                 empregado:
 *                   type: object
 *                   properties:
 *                     idEmpregado:
 *                       type: integer
 *                     nomeEmpregado:
 *                       type: string
 *                     email:
 *                       type: string
 *                     idCargo:
 *                       type: integer
 *                     ativo:
 *                       type: boolean
 *       400:
 *         description: Erro no login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro no login"
 *                 error:
 *                   type: string
 *                   example: "Senha incorreta."
 */
router.post("/login", login);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Faz logout do usuário autenticado.
 *     tags:
 *       - Autenticação
 *     description: Faz logout do usuário, limpando o cookie JWT.
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout realizado com sucesso"
 *       500:
 *         description: Erro ao realizar logout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao realizar logout"
 */
router.post("/logout", logout);

/**
 * @openapi
 * /auth/success:
 *   get:
 *     summary: Rota de sucesso da autenticação.
 *     tags:
 *       - Autenticação
 *     description: Retorna uma mensagem de sucesso após a autenticação via Google OAuth.
 *     responses:
 *       200:
 *         description: Mensagem de sucesso e dados do usuário autenticado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de autenticação bem-sucedida.
 *                   example: "Autenticação bem-sucedida!"
 *                 user:
 *                   type: object
 *                   description: Dados do usuário autenticado.
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID do usuário.
 *                     email:
 *                       type: string
 *                       description: E-mail do usuário autenticado.
 */
router.get("/success", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Usuário não autenticado." });
  }
  res.json({ message: "Autenticação bem-sucedida!", user: req.user });
});

/**
 * @openapi
 * /auth/failure:
 *   get:
 *     summary: Rota de falha de autenticação.
 *     tags:
 *       - Autenticação
 *     description: Retorna uma mensagem de falha quando a autenticação via Google OAuth falha.
 *     responses:
 *       401:
 *         description: Mensagem de falha de autenticação.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de falha de autenticação.
 *                   example: "Falha na autenticação."
 */
router.get("/failure", (req, res) => {
  res.status(401).json({ message: "Falha na autenticação." });
});

export default router;
