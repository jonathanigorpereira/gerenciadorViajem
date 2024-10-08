import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(403).json({ message: "Token não fornecido" });
    }

    // Verifica e decodifica o token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Adiciona os dados do usuário no req.user
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Token inválido ou expirado", error: error.message });
  }
};
