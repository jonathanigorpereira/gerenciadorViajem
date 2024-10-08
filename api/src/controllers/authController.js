import { loginService } from "../services/authService.js";

// Função de login
export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Chama o serviço de login
    const { token, empregado } = await loginService(email, senha);

    // Armazenar o token em um cookie seguro
    res.cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // Expira em 1 hora
    });

    // Retornar o token e os dados do empregado no corpo da resposta
    return res.status(200).json({
      message: "Login realizado com sucesso",
      token, // Inclui o token JWT na resposta JSON
      empregado: {
        idEmpregado: empregado.idEmpregado,
        nomeEmpregado: empregado.nomeEmpregado,
        email: empregado.email,
        idCargo: empregado.idCargo,
        ativo: empregado.ativo,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: "Erro no login",
      error: error.message,
    });
  }
};

// Função de logout
export const logout = (req, res) => {
  try {
    // Limpa o cookie JWT
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Logout realizado com sucesso",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao realizar logout",
      error: error.message,
    });
  }
};
