import {
  criarEmpregado,
  listarEmpregadosComCargos,
  buscarEmpregadoPorId,
  atualizarEmpregado,
  excluirEmpregado,
  verificarCargo,
} from "../services/empregadoService.js";
import Empregado from "../models/Empregado.js";
import Cargo from "../models/Cargo.js";
import { hashPassword } from "../utils/PasswordEncrypt.js";

// Mocks
jest.mock("../models/Empregado.js");
jest.mock("../models/Cargo.js");
jest.mock("../utils/PasswordEncrypt.js");

describe("Testes Unitários para o Serviço Empregado", () => {
  const mockEmpregado = {
    idEmpregado: "1",
    nomeEmpregado: "João Silva",
    email: "joao@empresa.com",
    ativo: true,
    idCargo: "123",
    senha: "senha123",
    save: jest.fn().mockResolvedValue(this),
    toObject: jest.fn().mockReturnValue({
      idEmpregado: "1",
      nomeEmpregado: "João Silva",
      ativo: true,
    }),
  };

  const mockCargo = {
    idCargo: "123",
    nomeCargo: "Desenvolvedor",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Empregado.mockImplementation(() => mockEmpregado); // Mock da criação do empregado
    Cargo.findOne.mockResolvedValue(mockCargo); // Mock do cargo
    hashPassword.mockResolvedValue("senhaHasheada"); // Mock do hash de senha
  });

  // Teste para criar um novo empregado
  test("Deve criar um novo empregado", async () => {
    const resultado = await criarEmpregado(mockEmpregado);

    expect(Empregado).toHaveBeenCalledTimes(1);
    expect(hashPassword).toHaveBeenCalledWith("senha123");
    expect(mockEmpregado.save).toHaveBeenCalled(); // Verifica se o save foi chamado
    expect(mockEmpregado.save).toHaveReturned(); // Verifica se save retornou corretamente
    expect(resultado).toMatchObject({
      nomeEmpregado: "João Silva",
      ativo: true,
    });
  });

  // Teste para listar todos os empregados com seus respectivos cargos
  test("Deve listar todos os empregados com seus cargos", async () => {
    Empregado.find.mockResolvedValue([mockEmpregado]);

    const resultado = await listarEmpregadosComCargos();

    expect(Empregado.find).toHaveBeenCalled(); // Verifica se `find` foi chamado
    expect(Cargo.findOne).toHaveBeenCalledWith({ idCargo: "123", ativo: true }); // Verifica se `findOne` do Cargo foi chamado
    expect(resultado).toEqual([
      {
        idEmpregado: "1",
        nomeEmpregado: "João Silva",
        email: "joao@empresa.com",
        ativo: true,
        cargo: {
          idCargo: "123",
          nomeCargo: "Desenvolvedor",
        },
      },
    ]);
  });

  // Teste para buscar um empregado por ID
  test("Deve buscar um empregado por ID", async () => {
    Empregado.findOne.mockResolvedValue(mockEmpregado); // Simula o empregado sendo encontrado

    const resultado = await buscarEmpregadoPorId("1");

    expect(Empregado.findOne).toHaveBeenCalledWith({ idEmpregado: "1" });
    expect(resultado).toMatchObject({
      idEmpregado: "1",
      nomeEmpregado: "João Silva",
    });
  });

  // Teste para atualizar um empregado
  test("Deve atualizar um empregado", async () => {
    Empregado.findOne.mockResolvedValue(mockEmpregado);
    Cargo.findOne.mockResolvedValue(mockCargo);

    const dadosAtualizados = {
      nomeEmpregado: "João Silva Atualizado",
      email: "joao.atualizado@empresa.com",
    };

    const resultado = await atualizarEmpregado("1", dadosAtualizados);

    expect(Empregado.findOne).toHaveBeenCalledWith({ idEmpregado: "1" });
    expect(mockEmpregado.save).toHaveBeenCalled();
    expect(mockEmpregado.save).toHaveReturned();
    expect(resultado).toMatchObject({
      nomeEmpregado: "João Silva Atualizado",
      email: "joao.atualizado@empresa.com",
      cargo: {
        idCargo: "123",
        nomeCargo: "Desenvolvedor",
      },
    });
  });

  // Teste para excluir um empregado
  test("Deve excluir um empregado", async () => {
    Empregado.findOne.mockResolvedValue(mockEmpregado);
    Empregado.deleteOne.mockResolvedValue({ deletedCount: 1 });

    const resultado = await excluirEmpregado("1");

    expect(Empregado.findOne).toHaveBeenCalledWith({ idEmpregado: "1" });
    expect(Empregado.deleteOne).toHaveBeenCalledWith({ idEmpregado: "1" });
    expect(resultado).toEqual({ message: "Empregado excluído com sucesso" });
  });

  // Teste para verificar se o cargo existe
  test("Deve verificar se o cargo existe", async () => {
    const resultado = await verificarCargo("123");

    expect(Cargo.findOne).toHaveBeenCalledWith({ idCargo: "123" });
    expect(resultado).toEqual(mockCargo);
  });

  // Teste para falha ao buscar empregado por ID inexistente
  test("Deve retornar erro ao buscar empregado por ID inexistente", async () => {
    Empregado.findOne.mockResolvedValue(null);

    await expect(buscarEmpregadoPorId("idInvalido")).rejects.toThrow(
      "Não foi possível buscar o empregado."
    );
  });

  // Teste para falha ao excluir empregado inexistente
  test("Deve retornar erro ao tentar excluir empregado inexistente", async () => {
    Empregado.findOne.mockResolvedValue(null);

    await expect(excluirEmpregado("idInvalido")).rejects.toThrow(
      "Não foi possível excluir o empregado."
    );
  });
});
