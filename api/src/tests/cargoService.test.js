import {
  criarCargo,
  listarCargos,
  buscarCargoPorId,
  atualizarCargo,
  excluirCargo,
} from "../services/cargoService";
import Cargo from "../models/Cargo";

// Mock do model Cargo
jest.mock("../models/Cargo");

describe("Cargo Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Teste para criação de um novo cargo
  describe("Cargo Service - criarCargo", () => {
    it("deve criar um novo cargo com sucesso", async () => {
      const mockCargo = { nomeCargo: "Desenvolvedor", ativo: true };

      // Mockando a instância de Cargo
      const mockSave = jest.fn().mockResolvedValue(mockCargo);

      // Criando a implementação do mock para Cargo
      Cargo.mockImplementation(() => {
        return {
          ...mockCargo,
          save: mockSave,
        };
      });

      const resultado = await criarCargo(mockCargo);

      // Verificar se o cargo foi criado corretamente
      expect(resultado.nomeCargo).toBe(mockCargo.nomeCargo);
      expect(resultado.ativo).toBe(mockCargo.ativo);
      expect(Cargo).toHaveBeenCalled();
      expect(mockSave).toHaveBeenCalled();
    });

    it("deve lançar um erro ao tentar criar um cargo", async () => {
      // Simulando erro ao salvar
      const mockSave = jest.fn().mockRejectedValue(new Error("Erro ao salvar"));
      Cargo.mockImplementation(() => ({
        save: mockSave,
      }));

      await expect(criarCargo({ nomeCargo: "Desenvolvedor" })).rejects.toThrow(
        "Erro ao criar o cargo: Erro ao salvar"
      );
    });
  });

  // Teste para listar todos os cargos
  describe("listarCargos", () => {
    it("deve listar todos os cargos com sucesso", async () => {
      const mockCargos = [
        { nomeCargo: "Desenvolvedor", ativo: true },
        { nomeCargo: "Gerente", ativo: true },
      ];

      Cargo.find.mockResolvedValue(mockCargos);

      const resultado = await listarCargos();

      expect(resultado).toEqual(mockCargos);
      expect(Cargo.find).toHaveBeenCalled();
    });

    it("deve lançar um erro ao listar cargos", async () => {
      Cargo.find.mockRejectedValue(new Error("Erro ao listar"));

      await expect(listarCargos()).rejects.toThrow(
        "Erro ao listar os cargos: Erro ao listar"
      );
    });
  });

  // Teste para buscar um cargo por ID
  describe("buscarCargoPorId", () => {
    it("deve retornar o cargo quando encontrado", async () => {
      const mockCargo = {
        idCargo: 123,
        nomeCargo: "Desenvolvedor",
        ativo: true,
      };

      Cargo.findOne.mockResolvedValue(mockCargo);

      const resultado = await buscarCargoPorId(123);

      expect(Cargo.findOne).toHaveBeenCalledWith({ idCargo: 123 });
      expect(resultado).toEqual(mockCargo);
    });

    it("deve lançar um erro se o cargo não for encontrado", async () => {
      Cargo.findOne.mockResolvedValue(null);

      await expect(buscarCargoPorId(123)).rejects.toThrow(
        "Cargo não encontrado"
      );
    });

    it("deve lançar um erro ao buscar o cargo", async () => {
      Cargo.findOne.mockRejectedValue(new Error("Erro ao buscar"));

      await expect(buscarCargoPorId(123)).rejects.toThrow(
        "Erro ao buscar o cargo: Erro ao buscar"
      );
    });
  });

  // Teste para atualizar um cargo
  describe("atualizarCargo", () => {
    it("deve atualizar um cargo com sucesso", async () => {
      const mockCargo = {
        idCargo: 123,
        nomeCargo: "Desenvolvedor Atualizado",
        ativo: true,
      };

      Cargo.findOneAndUpdate.mockResolvedValue(mockCargo);

      const resultado = await atualizarCargo(123, {
        nomeCargo: "Desenvolvedor Atualizado",
      });

      expect(Cargo.findOneAndUpdate).toHaveBeenCalledWith(
        { idCargo: 123 },
        { nomeCargo: "Desenvolvedor Atualizado" },
        { new: true, runValidators: true }
      );
      expect(resultado).toEqual(mockCargo);
    });

    it("deve lançar um erro se o cargo não for encontrado para atualização", async () => {
      Cargo.findOneAndUpdate.mockResolvedValue(null);

      await expect(atualizarCargo(123, {})).rejects.toThrow(
        "Cargo não encontrado para atualização"
      );
    });

    it("deve lançar um erro ao tentar atualizar o cargo", async () => {
      Cargo.findOneAndUpdate.mockRejectedValue(new Error("Erro ao atualizar"));

      await expect(atualizarCargo(123, {})).rejects.toThrow(
        "Erro ao atualizar o cargo: Erro ao atualizar"
      );
    });
  });

  // Teste para excluir um cargo
  describe("excluirCargo", () => {
    it("deve excluir um cargo com sucesso", async () => {
      Cargo.findOneAndDelete.mockResolvedValue({ idCargo: 123 });

      const resultado = await excluirCargo(123);

      expect(Cargo.findOneAndDelete).toHaveBeenCalledWith({ idCargo: 123 });
      expect(resultado).toEqual({ message: "Cargo excluído com sucesso" });
    });

    it("deve lançar um erro se o cargo não for encontrado para exclusão", async () => {
      Cargo.findOneAndDelete.mockResolvedValue(null);

      await expect(excluirCargo(123)).rejects.toThrow(
        "Cargo não encontrado para exclusão"
      );
    });

    it("deve lançar um erro ao tentar excluir o cargo", async () => {
      Cargo.findOneAndDelete.mockRejectedValue(new Error("Erro ao excluir"));

      await expect(excluirCargo(123)).rejects.toThrow(
        "Erro ao excluir o cargo: Erro ao excluir"
      );
    });
  });
});
