import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Empregado from "../models/Empregado.js";
import loginValidation from "../validations/loginValidation.js";

export const loginService = async (email, senha) => {
  // Validação dos dados de login
  const { error } = loginValidation({ email, senha });
  if (error) {
    throw new Error(
      `Erro na validação dos dados: ${error.details
        .map((e) => e.message)
        .join(", ")}`
    );
  }

  // Procurar o empregado pelo email
  const empregado = await Empregado.findOne({ email });
  if (!empregado) {
    throw new Error("Usuário não encontrado.");
  }

  // Verificar se o empregado está ativo
  if (!empregado.ativo) {
    throw new Error("Conta desativada. Entre em contato com o suporte.");
  }

  // Verificar se a senha está correta
  const senhaValida = await bcrypt.compare(senha, empregado.senha);
  if (!senhaValida) {
    throw new Error("Senha incorreta.");
  }

  // Gerar o token JWT com dados essenciais
  const token = jwt.sign(
    {
      idEmpregado: empregado.idEmpregado,
      nomeEmpregado: empregado.nomeEmpregado,
      idCargo: empregado.idCargo,
      email: empregado.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { token, empregado };
};
