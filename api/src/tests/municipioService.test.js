import axios from "axios";
import Municipio from "../models/Municipio";
import UnidadeFederativa from "../models/UnidadeFederativa";
import {
  createMunicipio,
  getMunicipioById,
  updateMunicipio,
  deleteMunicipio,
  verificarMunicipioPorEstado,
} from "../services/municipioService";
import {
  createMunicipioValidation,
  updateMunicipioValidation,
} from "../validations/municipioValidation";

jest.mock("axios");
jest.mock("../models/Municipio");
jest.mock("../models/UnidadeFederativa");

describe("Municipio Service Tests", () => {
  describe("verificarMunicipioPorEstado", () => {
    it("deve retornar true quando o município pertence ao estado correto", async () => {
      const mockMunicipios = [{ nome: "Porto Alegre" }];
      axios.get.mockResolvedValue({ data: mockMunicipios });

      const result = await verificarMunicipioPorEstado("Porto Alegre", "RS");
      expect(result).toBe(true);
    });

    it("deve retornar false quando o município não pertence ao estado", async () => {
      const mockMunicipios = [{ nome: "São Paulo" }];
      axios.get.mockResolvedValue({ data: mockMunicipios });

      const result = await verificarMunicipioPorEstado("Porto Alegre", "SP");
      expect(result).toBe(false);
    });

    it("deve lançar um erro ao consultar a API do IBGE falhar", async () => {
      axios.get.mockRejectedValue(new Error("API error"));

      await expect(
        verificarMunicipioPorEstado("Porto Alegre", "RS")
      ).rejects.toThrow("Erro ao validar município com a API do IBGE.");
    });
  });

  describe("createMunicipio", () => {
    it("deve criar um município quando os dados forem válidos", async () => {
      const mockData = {
        NomeMunicipio: "Porto Alegre",
        idUnidadeFederativa: 1,
      };
      const mockUnidade = {
        SiglaUnidadeFederativa: "RS",
        NomeUnidadeFederativa: "Rio Grande do Sul",
      };

      createMunicipioValidation.validate = jest
        .fn()
        .mockReturnValue({ error: null });
      UnidadeFederativa.findOne.mockResolvedValue(mockUnidade);
      Municipio.findOne.mockResolvedValue(null); // Município não existe
      axios.get.mockResolvedValue({ data: [{ nome: "Porto Alegre" }] });

      Municipio.prototype.save = jest.fn().mockResolvedValue(mockData);

      const result = await createMunicipio(mockData);

      expect(result.NomeMunicipio).toBe("Porto Alegre");
      expect(Municipio.findOne).toHaveBeenCalledWith({
        NomeMunicipio: "Porto Alegre",
      });
    });

    it("deve retornar erro ao tentar criar um município existente", async () => {
      const mockData = {
        NomeMunicipio: "Porto Alegre",
        idUnidadeFederativa: 1,
      };
      const mockUnidade = {
        SiglaUnidadeFederativa: "RS",
        NomeUnidadeFederativa: "Rio Grande do Sul",
      };

      createMunicipioValidation.validate = jest
        .fn()
        .mockReturnValue({ error: null });
      UnidadeFederativa.findOne.mockResolvedValue(mockUnidade);
      Municipio.findOne.mockResolvedValue(mockData); // Município já existe

      await expect(createMunicipio(mockData)).rejects.toThrow(
        "Municipio já cadastrado."
      );
    });

    it("deve retornar erro se os dados de entrada forem inválidos", async () => {
      const mockData = { NomeMunicipio: "", idUnidadeFederativa: 1 };
      createMunicipioValidation.validate = jest.fn().mockReturnValue({
        error: { details: [{ message: "Nome inválido" }] },
      });

      await expect(createMunicipio(mockData)).rejects.toThrow("Nome inválido");
    });

    it("deve retornar erro se a unidade federativa não existir", async () => {
      const mockData = {
        NomeMunicipio: "Porto Alegre",
        idUnidadeFederativa: 1,
      };
      createMunicipioValidation.validate = jest
        .fn()
        .mockReturnValue({ error: null });
      UnidadeFederativa.findOne.mockResolvedValue(null); // UF não existe

      await expect(createMunicipio(mockData)).rejects.toThrow(
        "Unidade Federativa não existe."
      );
    });
  });

  describe("getMunicipioById", () => {
    it("deve retornar o município com informações da unidade federativa", async () => {
      const mockMunicipio = {
        idMunicipio: 1,
        NomeMunicipio: "Porto Alegre",
        idUnidadeFederativa: 1,
        toObject: jest.fn().mockReturnValue({
          idMunicipio: 1,
          NomeMunicipio: "Porto Alegre",
          idUnidadeFederativa: 1,
        }),
      };
      const mockUnidade = {
        idUnidadeFederativa: 1,
        NomeUnidadeFederativa: "Rio Grande do Sul",
      };

      Municipio.findOne.mockResolvedValue(mockMunicipio);
      UnidadeFederativa.findOne.mockResolvedValue(mockUnidade);

      const result = await getMunicipioById(1);

      expect(result.NomeMunicipio).toBe("Porto Alegre");
      expect(result.unidadeFederativa.NomeUnidadeFederativa).toBe(
        "Rio Grande do Sul"
      );
    });

    it("deve lançar um erro se o município não for encontrado", async () => {
      Municipio.findOne.mockResolvedValue(null);

      await expect(getMunicipioById(999)).rejects.toThrow(
        "Município não encontrado."
      );
    });
  });

  describe("updateMunicipio", () => {
    it("deve atualizar o município com sucesso", async () => {
      const mockMunicipio = { idMunicipio: 1, NomeMunicipio: "Porto Alegre" };
      updateMunicipioValidation.validate = jest
        .fn()
        .mockReturnValue({ error: null });
      Municipio.findOneAndUpdate.mockResolvedValue(mockMunicipio);

      const result = await updateMunicipio(1, {
        NomeMunicipio: "Porto Alegre",
      });
      expect(result.NomeMunicipio).toBe("Porto Alegre");
    });

    it("deve lançar um erro se o município não for encontrado para atualização", async () => {
      updateMunicipioValidation.validate = jest
        .fn()
        .mockReturnValue({ error: null });
      Municipio.findOneAndUpdate.mockResolvedValue(null); // Município não encontrado

      await expect(
        updateMunicipio(999, { NomeMunicipio: "Inexistente" })
      ).rejects.toThrow("Município não encontrado para atualização.");
    });
  });

  describe("deleteMunicipio", () => {
    it("deve excluir o município com sucesso", async () => {
      const mockMunicipio = { idMunicipio: 1, NomeMunicipio: "Porto Alegre" };
      Municipio.findOneAndDelete.mockResolvedValue(mockMunicipio);

      const result = await deleteMunicipio(1);
      expect(result.message).toBe("Município excluído com sucesso");
    });

    it("deve lançar um erro se o município não for encontrado para exclusão", async () => {
      Municipio.findOneAndDelete.mockResolvedValue(null); // Município não encontrado

      await expect(deleteMunicipio(999)).rejects.toThrow(
        "Município não encontrado para exclusão."
      );
    });
  });
});
