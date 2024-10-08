import {
  criarCargo,
  listarCargos,
  buscarCargoPorId,
  atualizarCargo,
  excluirCargo,
} from "../services/cargoService.js";
import Cargo from "../models/Cargo.js";

jest.mock("../models/Cargo.js"); // Mock do modelo Cargo

describe("Testes Unitários para o Serviço Cargo", () => {
  const mockCargo = { nomeCargo: "Desenvolvedor 2", ativo: true };
  const mockCargos = [
    { nomeCargo: "Desenvolvedor", ativo: true },
    { nomeCargo: "Gerente", ativo: true },
  ];

  beforeEach(() => {
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  // Teste para criar um novo cargo
  test("Deve criar um novo cargo", async () => {
    // Mock da implementação do Cargo
    const mockCargoInstance = {
      nomeCargo: mockCargo.nomeCargo,
      ativo: mockCargo.ativo,
      save: jest.fn().mockResolvedValue(mockCargo),
    };

    Cargo.mockImplementation(() => mockCargoInstance);

    const resultado = await criarCargo(mockCargo);
    expect(Cargo).toHaveBeenCalledTimes(1);

    expect(resultado).toMatchObject({
      nomeCargo: mockCargo.nomeCargo,
      ativo: mockCargo.ativo,
    });
  });

  // Teste para listar todos os cargos
  test("Deve listar todos os cargos", async () => {
    Cargo.find.mockResolvedValue(mockCargos);
    const resultado = await listarCargos();
    expect(Cargo.find).toHaveBeenCalled();
    expect(resultado).toEqual(mockCargos);
  });

  // Teste para buscar cargo por ID
  test("Deve buscar um cargo por ID", async () => {
    Cargo.findById.mockResolvedValue(mockCargo);
    const resultado = await buscarCargoPorId("idMock");
    expect(Cargo.findById).toHaveBeenCalledWith("idMock");
    expect(resultado).toEqual(mockCargo);
  });

  // Teste para falha ao buscar cargo por ID
  test("Deve retornar erro se o cargo não for encontrado", async () => {
    Cargo.findById.mockResolvedValue(null);
    await expect(buscarCargoPorId("idInvalido")).rejects.toThrow(
      "Cargo não encontrado"
    );
  });

  // Teste para atualizar um cargo
  test("Deve atualizar um cargo", async () => {
    Cargo.findByIdAndUpdate.mockResolvedValue(mockCargo);
    const resultado = await atualizarCargo("idMock", mockCargo);
    expect(Cargo.findByIdAndUpdate).toHaveBeenCalledWith("idMock", mockCargo, {
      new: true,
      runValidators: true,
    });
    expect(resultado).toEqual(mockCargo);
  });

  // Teste para falha ao atualizar um cargo que não existe
  test("Deve retornar erro ao tentar atualizar um cargo inexistente", async () => {
    Cargo.findByIdAndUpdate.mockResolvedValue(null);
    await expect(atualizarCargo("idInvalido", mockCargo)).rejects.toThrow(
      "Cargo não encontrado para atualização"
    );
  });

  // Teste para excluir um cargo
  test("Deve excluir um cargo", async () => {
    Cargo.findByIdAndDelete.mockResolvedValue(mockCargo);
    const resultado = await excluirCargo("idMock");
    expect(Cargo.findByIdAndDelete).toHaveBeenCalledWith("idMock");
    expect(resultado).toEqual({ message: "Cargo excluído com sucesso" });
  });

  // Teste para falha ao excluir um cargo que não existe
  test("Deve retornar erro ao tentar excluir um cargo inexistente", async () => {
    Cargo.findByIdAndDelete.mockResolvedValue(null);
    await expect(excluirCargo("idInvalido")).rejects.toThrow(
      "Cargo não encontrado para exclusão"
    );
  });
});
