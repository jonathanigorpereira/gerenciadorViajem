import {
  createUnidadeFederativa,
  getUnidadeFederativaById,
  getAllUnidadesFederativas,
  updateUnidadeFederativa,
  deleteUnidadeFederativa,
} from "../services/unidadeFederativaService";
import UnidadeFederativa from "../models/UnidadeFederativa";

// Mock do model UnidadeFederativa
jest.mock("../models/UnidadeFederativa");

describe("UnidadeFederativa Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Teste para criação de uma Unidade Federativa
  describe("createUnidadeFederativa", () => {
    it("deve criar uma nova Unidade Federativa com sucesso", async () => {
      const mockData = {
        SiglaUnidadeFederativa: "SP",
        NomeUnidadeFederativa: "São Paulo",
        ativo: true,
      };

      UnidadeFederativa.findOne.mockResolvedValue(null);
      UnidadeFederativa.prototype.save = jest.fn().mockResolvedValue(mockData);

      const result = await createUnidadeFederativa(mockData);
      expect(result).toEqual(mockData);
      expect(UnidadeFederativa.findOne).toHaveBeenCalledWith({
        $or: [
          { SiglaUnidadeFederativa: "SP" },
          { NomeUnidadeFederativa: "São Paulo" },
        ],
      });
      expect(UnidadeFederativa.prototype.save).toHaveBeenCalled();
    });

    it("deve lançar um erro se a Unidade Federativa já existir", async () => {
      const mockData = {
        SiglaUnidadeFederativa: "SP",
        NomeUnidadeFederativa: "São Paulo",
      };

      UnidadeFederativa.findOne.mockResolvedValue(mockData);

      await expect(createUnidadeFederativa(mockData)).rejects.toThrow(
        "Já existe uma Unidade Federativa com essa sigla ou nome."
      );
    });
  });

  // Teste para buscar Unidade Federativa por ID
  describe("getUnidadeFederativaById", () => {
    it("deve retornar a Unidade Federativa quando encontrada", async () => {
      const mockData = {
        idUnidadeFederativa: 123,
        SiglaUnidadeFederativa: "SP",
        NomeUnidadeFederativa: "São Paulo",
      };

      UnidadeFederativa.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockData),
      });

      const result = await getUnidadeFederativaById(123);
      expect(result).toEqual(mockData);
      expect(UnidadeFederativa.findOne).toHaveBeenCalledWith({
        idUnidadeFederativa: 123,
      });
    });

    it("deve lançar um erro se a Unidade Federativa não for encontrada", async () => {
      UnidadeFederativa.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      await expect(getUnidadeFederativaById(123)).rejects.toThrow(
        "Unidade Federativa não encontrada"
      );
    });
  });

  // Teste para listar todas as Unidades Federativas
  describe("getAllUnidadesFederativas", () => {
    it("deve retornar todas as Unidades Federativas", async () => {
      const mockData = [
        { SiglaUnidadeFederativa: "SP", NomeUnidadeFederativa: "São Paulo" },
        {
          SiglaUnidadeFederativa: "RJ",
          NomeUnidadeFederativa: "Rio de Janeiro",
        },
      ];

      UnidadeFederativa.find.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockData),
      });

      const result = await getAllUnidadesFederativas();
      expect(result).toEqual(mockData);
      expect(UnidadeFederativa.find).toHaveBeenCalled();
    });
  });

  // Teste para atualizar uma Unidade Federativa
  describe("updateUnidadeFederativa", () => {
    it("deve atualizar uma Unidade Federativa com sucesso", async () => {
      const mockData = {
        idUnidadeFederativa: 123,
        SiglaUnidadeFederativa: "SP",
        NomeUnidadeFederativa: "São Paulo Atualizado",
      };

      // Simular que a unidade existe na primeira chamada de findOne
      UnidadeFederativa.findOne
        .mockResolvedValueOnce({ idUnidadeFederativa: 123 })
        .mockResolvedValueOnce(null);

      // Simular que a unidade foi atualizada com sucesso
      UnidadeFederativa.findOneAndUpdate.mockResolvedValue(mockData);

      const result = await updateUnidadeFederativa(123, mockData);

      expect(result).toEqual(mockData);

      // Verificar se findOne foi chamado duas vezes (uma para existência, outra para duplicidade)
      expect(UnidadeFederativa.findOne).toHaveBeenCalledTimes(2);

      // Verificar se findOneAndUpdate foi chamado com os parâmetros corretos
      expect(UnidadeFederativa.findOneAndUpdate).toHaveBeenCalledWith(
        { idUnidadeFederativa: 123 },
        mockData,
        { new: true }
      );
    });

    it("deve lançar um erro se a Unidade Federativa não for encontrada para atualização", async () => {
      // Simular que a unidade não foi encontrada
      UnidadeFederativa.findOne.mockResolvedValue(null);

      await expect(updateUnidadeFederativa(123, {})).rejects.toThrow(
        "Unidade Federativa não encontrada para atualização."
      );
    });

    it("deve lançar um erro se a atualização resultar em duplicidade", async () => {
      const mockData = {
        idUnidadeFederativa: 123,
        SiglaUnidadeFederativa: "SP",
        NomeUnidadeFederativa: "São Paulo",
      };

      // Simular que a unidade atual existe na primeira chamada
      UnidadeFederativa.findOne
        .mockResolvedValueOnce({ idUnidadeFederativa: 123 })
        .mockResolvedValueOnce({ idUnidadeFederativa: 456 });

      await expect(updateUnidadeFederativa(123, mockData)).rejects.toThrow(
        "Já existe uma Unidade Federativa com essa sigla ou nome."
      );
    });
  });

  // Teste para deletar uma Unidade Federativa
  describe("deleteUnidadeFederativa", () => {
    it("deve deletar uma Unidade Federativa com sucesso", async () => {
      const mockData = {
        idUnidadeFederativa: 123,
        SiglaUnidadeFederativa: "SP",
        NomeUnidadeFederativa: "São Paulo",
      };

      UnidadeFederativa.findById.mockResolvedValue(mockData);
      UnidadeFederativa.findByIdAndDelete.mockResolvedValue(mockData);

      const result = await deleteUnidadeFederativa(123);
      expect(result).toEqual(mockData);
      expect(UnidadeFederativa.findById).toHaveBeenCalledWith(123);
      expect(UnidadeFederativa.findByIdAndDelete).toHaveBeenCalledWith(123);
    });

    it("deve lançar um erro se a Unidade Federativa não for encontrada para exclusão", async () => {
      UnidadeFederativa.findById.mockResolvedValue(null);

      await expect(deleteUnidadeFederativa(123)).rejects.toThrow(
        "Unidade Federativa não encontrada para exclusão."
      );
    });
  });
});
