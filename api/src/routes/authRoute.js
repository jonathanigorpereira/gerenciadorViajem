import express from "express";
import passport from "passport";

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
// Rota de callback após a autenticação
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
  console.log("req.user na rota /success:", req.user);
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

/**
 * @openapi
 * /auth/logout:
 *   get:
 *     summary: Faz logout do usuário autenticado.
 *     tags:
 *       - Autenticação
 *     description: Faz o logout do usuário e redireciona para a página inicial.
 *     responses:
 *       302:
 *         description: Redireciona para a página inicial após o logout.
 */
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/api-documentacao/");
  });
});

export default router;
