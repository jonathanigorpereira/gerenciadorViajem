import {
  createUnidadeFederativa,
  getUnidadeFederativaById,
  getAllUnidadesFederativas,
  updateUnidadeFederativa,
  deleteUnidadeFederativa,
} from "../services/unidadeFederativaService";
import UnidadeFederativa from "../models/UnidadeFederativa";

// Mocking do modelo UnidadeFederativa
jest.mock("../models/UnidadeFederativa");

describe("Serviço de Unidade Federativa", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createUnidadeFederativa", () => {
    it("deve criar uma nova Unidade Federativa com sucesso", async () => {
      const dados = {
        SiglaUnidadeFederativa: "SP",
        NomeUnidadeFederativa: "São Paulo",
      };

      UnidadeFederativa.findOne.mockResolvedValue(null);
      UnidadeFederativa.prototype.save.mockResolvedValue(dados);

      const resultado = await createUnidadeFederativa(dados);

      expect(UnidadeFederativa.findOne).toHaveBeenCalledWith({
        $or: [
          { SiglaUnidadeFederativa: dados.SiglaUnidadeFederativa },
          { NomeUnidadeFederativa: dados.NomeUnidadeFederativa },
        ],
      });
      expect(resultado).toEqual(dados);
    });

    it("deve lançar um erro se a Unidade Federativa já existir", async () => {
      const dados = {
        SiglaUnidadeFederativa: "SP",
        NomeUnidadeFederativa: "São Paulo",
      };

      UnidadeFederativa.findOne.mockResolvedValue(dados);

      await expect(createUnidadeFederativa(dados)).rejects.toThrow(
        "Já existe uma Unidade Federativa com essa sigla ou nome."
      );
    });
  });

  describe("getUnidadeFederativaById", () => {
    it("deve retornar a Unidade Federativa pelo ID", async () => {
      const unidadeFederativa = {
        idUnidadeFederativa: 1,
        SiglaUnidadeFederativa: "SP",
        NomeUnidadeFederativa: "São Paulo",
      };

      UnidadeFederativa.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValue(unidadeFederativa),
      });

      const resultado = await getUnidadeFederativaById(1);

      expect(UnidadeFederativa.findOne).toHaveBeenCalledWith({
        idUnidadeFederativa: 1,
      });
      expect(resultado).toEqual(unidadeFederativa);
    });

    it("deve lançar um erro se a Unidade Federativa não for encontrada", async () => {
      UnidadeFederativa.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      await expect(getUnidadeFederativaById(1)).rejects.toThrow(
        "Unidade Federativa não encontrada"
      );
    });
  });

  describe("getAllUnidadesFederativas", () => {
    it("deve retornar todas as Unidades Federativas", async () => {
      const unidades = [
        { SiglaUnidadeFederativa: "SP", NomeUnidadeFederativa: "São Paulo" },
        {
          SiglaUnidadeFederativa: "RJ",
          NomeUnidadeFederativa: "Rio de Janeiro",
        },
      ];

      UnidadeFederativa.find.mockReturnValue({
        lean: jest.fn().mockResolvedValue(unidades),
      });

      const resultado = await getAllUnidadesFederativas();

      expect(UnidadeFederativa.find).toHaveBeenCalled();
      expect(resultado).toEqual(unidades);
    });
  });

  describe("updateUnidadeFederativa", () => {
    it("deve atualizar a Unidade Federativa com sucesso", async () => {
      const dados = {
        SiglaUnidadeFederativa: "RJ",
        NomeUnidadeFederativa: "Rio de Janeiro",
      };
      const unidadeExistente = {
        idUnidadeFederativa: 1,
        SiglaUnidadeFederativa: "SP",
        NomeUnidadeFederativa: "São Paulo",
      };

      // Mock para a primeira verificação de existência
      UnidadeFederativa.findOne
        .mockResolvedValueOnce(unidadeExistente)
        .mockResolvedValueOnce(null);

      UnidadeFederativa.findOneAndUpdate.mockResolvedValue({
        idUnidadeFederativa: 1,
        ...dados,
      });

      const resultado = await updateUnidadeFederativa(1, dados);

      expect(UnidadeFederativa.findOne).toHaveBeenCalledWith({
        idUnidadeFederativa: 1,
      });
      expect(UnidadeFederativa.findOne).toHaveBeenCalledWith({
        $or: [
          { SiglaUnidadeFederativa: dados.SiglaUnidadeFederativa },
          { NomeUnidadeFederativa: dados.NomeUnidadeFederativa },
        ],
        idUnidadeFederativa: { $ne: 1 },
      });
      expect(resultado).toEqual({ idUnidadeFederativa: 1, ...dados });
    });

    it("deve lançar um erro se a Unidade Federativa não for encontrada para atualização", async () => {
      UnidadeFederativa.findOne.mockResolvedValue(null);

      await expect(
        updateUnidadeFederativa(1, { NomeUnidadeFederativa: "Rio" })
      ).rejects.toThrow("Unidade Federativa não encontrada para atualização.");
    });
  });

  describe("deleteUnidadeFederativa", () => {
    it("deve excluir a Unidade Federativa com sucesso", async () => {
      const unidade = {
        _id: 1,
        SiglaUnidadeFederativa: "SP",
        NomeUnidadeFederativa: "São Paulo",
      };

      UnidadeFederativa.findById.mockResolvedValue(unidade);
      UnidadeFederativa.findByIdAndDelete.mockResolvedValue(unidade);

      const resultado = await deleteUnidadeFederativa(1);

      expect(UnidadeFederativa.findById).toHaveBeenCalledWith(1);
      expect(UnidadeFederativa.findByIdAndDelete).toHaveBeenCalledWith(1);
      expect(resultado).toEqual({
        message: "Unidade Federativa excluída com sucesso",
      });
    });

    it("deve lançar um erro se a Unidade Federativa não for encontrada para exclusão", async () => {
      UnidadeFederativa.findById.mockResolvedValue(null);

      await expect(deleteUnidadeFederativa(1)).rejects.toThrow(
        "Unidade Federativa não encontrada para exclusão."
      );
    });
  });
});
