import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Empregado from "../models/Empregado.js";
import loginValidation from "../validations/loginValidation.js";
import { loginService } from "../services/authService";

// Mock das dependências
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../models/Empregado.js");
jest.mock("../validations/loginValidation.js");

describe("Teste do authService", () => {
  const mockEmpregado = {
    idEmpregado: "123",
    nomeEmpregado: "Teste Empregado",
    idCargo: "456",
    email: "teste@empresa.com",
    senha: "hashedPassword",
    ativo: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "secretKey";
  });

  test("Deve retornar um token e empregado ao login com sucesso", async () => {
    // Mock da validação do login para ser bem-sucedida
    loginValidation.mockReturnValue({ error: null });

    // Mock para procurar o empregado pelo email
    Empregado.findOne.mockResolvedValue(mockEmpregado);

    // Mock da comparação da senha para ser válida
    bcrypt.compare.mockResolvedValue(true);

    // Mock da geração do token JWT
    jwt.sign.mockReturnValue("mockToken");

    // Chamada do serviço de login
    const { token, empregado } = await loginService(
      "teste@empresa.com",
      "senhaCorreta"
    );

    // Verificações
    expect(loginValidation).toHaveBeenCalledWith({
      email: "teste@empresa.com",
      senha: "senhaCorreta",
    });
    expect(Empregado.findOne).toHaveBeenCalledWith({
      email: "teste@empresa.com",
    });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "senhaCorreta",
      mockEmpregado.senha
    );
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        idEmpregado: mockEmpregado.idEmpregado,
        nomeEmpregado: mockEmpregado.nomeEmpregado,
        idCargo: mockEmpregado.idCargo,
        email: mockEmpregado.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Verificação do resultado final
    expect(token).toBe("mockToken");
    expect(empregado).toEqual(mockEmpregado);
  });

  test("Deve lançar erro quando a validação falhar", async () => {
    // Mock da validação do login para falhar
    loginValidation.mockReturnValue({
      error: { details: [{ message: "Erro de validação" }] },
    });

    await expect(
      loginService("emailInvalido", "senhaInvalida")
    ).rejects.toThrow("Erro na validação dos dados: Erro de validação");
  });

  test("Deve lançar erro quando o empregado não for encontrado", async () => {
    // Mock da validação para ser bem-sucedida
    loginValidation.mockReturnValue({ error: null });

    // Mock para retornar nenhum empregado encontrado
    Empregado.findOne.mockResolvedValue(null);

    await expect(loginService("emailNaoExiste", "senha")).rejects.toThrow(
      "Usuário não encontrado."
    );
  });

  test("Deve lançar erro quando a conta do empregado está desativada", async () => {
    // Mock da validação para ser bem-sucedida
    loginValidation.mockReturnValue({ error: null });

    // Mock para retornar um empregado desativado
    Empregado.findOne.mockResolvedValue({ ...mockEmpregado, ativo: false });

    await expect(loginService("teste@empresa.com", "senha")).rejects.toThrow(
      "Conta desativada. Entre em contato com o suporte."
    );
  });

  test("Deve lançar erro quando a senha estiver incorreta", async () => {
    // Mock da validação para ser bem-sucedida
    loginValidation.mockReturnValue({ error: null });

    // Mock para procurar o empregado pelo email
    Empregado.findOne.mockResolvedValue(mockEmpregado);

    // Mock da comparação da senha para ser inválida
    bcrypt.compare.mockResolvedValue(false);

    await expect(
      loginService("teste@empresa.com", "senhaIncorreta")
    ).rejects.toThrow("Senha incorreta.");
  });
});
