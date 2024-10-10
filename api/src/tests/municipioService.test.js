import {
  createMunicipio,
  getMunicipioById,
  updateMunicipio,
  deleteMunicipio,
  getAllMunicipios,
} from "../services/municipioService.js";
import Municipio from "../models/Municipio.js";
import UnidadeFederativa from "../models/UnidadeFederativa.js";
import {
  createMunicipioValidation,
  updateMunicipioValidation,
} from "../validations/municipioValidation.js";

// Mock the Mongoose models and validation
jest.mock("../models/Municipio.js");
jest.mock("../models/UnidadeFederativa.js");
jest.mock("../validations/municipioValidation.js");

describe("Municipio Service Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Teste para a criação de um município
  describe("createMunicipio", () => {
    it("deve criar um novo município com sucesso", async () => {
      const data = { NomeMunicipio: "São Paulo", idUnidadeFederativa: 35 };

      // Simula a validação sem erro
      createMunicipioValidation.validate.mockReturnValue({ error: null });

      // Simula a verificação de que o município não existe
      Municipio.findOne.mockResolvedValue(null);

      // Simula a criação do município
      Municipio.prototype.save = jest.fn().mockResolvedValue({
        idMunicipio: 1,
        NomeMunicipio: "São Paulo",
        idUnidadeFederativa: 35,
      });

      const result = await createMunicipio(data);

      expect(result).toEqual({
        idMunicipio: 1,
        NomeMunicipio: "São Paulo",
        idUnidadeFederativa: 35,
      });
      expect(Municipio.findOne).toHaveBeenCalledWith({
        NomeMunicipio: "São Paulo",
      });
      expect(Municipio.prototype.save).toHaveBeenCalled();
    });

    it("deve lançar erro se o município já existir", async () => {
      const data = { NomeMunicipio: "São Paulo", idUnidadeFederativa: 35 };

      createMunicipioValidation.validate.mockReturnValue({ error: null });
      Municipio.findOne.mockResolvedValue({ NomeMunicipio: "São Paulo" });

      await expect(createMunicipio(data)).rejects.toThrow(
        "Municipio já cadastrado."
      );
    });

    it("deve lançar erro se a validação falhar", async () => {
      const data = { NomeMunicipio: "São Paulo", idUnidadeFederativa: 35 };

      createMunicipioValidation.validate.mockReturnValue({
        error: { details: [{ message: "Validation error" }] },
      });

      await expect(createMunicipio(data)).rejects.toThrow("Validation error");
    });
  });

  // Teste para buscar um município por ID
  describe("getMunicipioById", () => {
    it("deve retornar um município com sucesso", async () => {
      const municipioMock = {
        idMunicipio: 1,
        NomeMunicipio: "São Paulo",
        idUnidadeFederativa: 35,
      };
      const unidadeFederativaMock = {
        idUnidadeFederativa: 35,
        NomeUnidadeFederativa: "SP",
      };

      Municipio.findOne.mockResolvedValue({
        ...municipioMock,
        toObject: () => municipioMock,
      });
      UnidadeFederativa.findOne.mockResolvedValue(unidadeFederativaMock);

      const result = await getMunicipioById(1);

      expect(result).toEqual({
        ...municipioMock,
        unidadeFederativa: unidadeFederativaMock,
      });
      expect(Municipio.findOne).toHaveBeenCalledWith({ idMunicipio: 1 });
      expect(UnidadeFederativa.findOne).toHaveBeenCalledWith({
        idUnidadeFederativa: 35,
      });
    });

    it("deve lançar erro se o município não for encontrado", async () => {
      Municipio.findOne.mockResolvedValue(null);

      await expect(getMunicipioById(1)).rejects.toThrow(
        "Município não encontrado."
      );
    });
  });

  // Teste para atualização de município
  describe("updateMunicipio", () => {
    it("deve atualizar um município com sucesso", async () => {
      const municipioMock = {
        idMunicipio: 1,
        NomeMunicipio: "São Paulo",
        idUnidadeFederativa: 35,
      };
      const data = { NomeMunicipio: "São Paulo Atualizado" };

      updateMunicipioValidation.validate.mockReturnValue({ error: null });
      Municipio.findOneAndUpdate.mockResolvedValue(municipioMock);

      const result = await updateMunicipio(1, data);

      expect(result).toEqual(municipioMock);
      expect(Municipio.findOneAndUpdate).toHaveBeenCalledWith(
        { idMunicipio: 1 },
        data,
        { new: true }
      );
    });

    it("deve lançar erro se a validação falhar", async () => {
      const data = { NomeMunicipio: "São Paulo Atualizado" };

      updateMunicipioValidation.validate.mockReturnValue({
        error: { details: [{ message: "Validation error" }] },
      });

      await expect(updateMunicipio(1, data)).rejects.toThrow(
        "Validation error"
      );
    });

    it("deve lançar erro se o município não for encontrado", async () => {
      Municipio.findOneAndUpdate.mockResolvedValue(null);
      updateMunicipioValidation.validate.mockReturnValue({ error: null });

      await expect(updateMunicipio(1, {})).rejects.toThrow(
        "Município não encontrado para atualização."
      );
    });
  });

  // Teste para deletar um município
  describe("deleteMunicipio", () => {
    it("deve excluir um município com sucesso", async () => {
      const municipioMock = { idMunicipio: 1, NomeMunicipio: "São Paulo" };

      Municipio.findOneAndDelete.mockResolvedValue({
        ...municipioMock,
        toObject: () => municipioMock,
      });

      const result = await deleteMunicipio(1);

      expect(result).toMatchObject(municipioMock);
      expect(Municipio.findOneAndDelete).toHaveBeenCalledWith({
        idMunicipio: 1,
      });
    });

    it("deve lançar erro se o município não for encontrado para exclusão", async () => {
      Municipio.findOneAndDelete.mockResolvedValue(null);

      await expect(deleteMunicipio(1)).rejects.toThrow(
        "Município não encontrado para exclusão."
      );
    });
  });

  // Teste para buscar todos os municípios
  describe("getAllMunicipios", () => {
    it("deve retornar todos os municípios com suas unidades federativas", async () => {
      const municipioMock = [
        { idMunicipio: 1, NomeMunicipio: "São Paulo", idUnidadeFederativa: 35 },
        {
          idMunicipio: 2,
          NomeMunicipio: "Rio de Janeiro",
          idUnidadeFederativa: 33,
        },
      ];
      const unidadeFederativaMock = [
        { idUnidadeFederativa: 35, NomeUnidadeFederativa: "SP" },
        { idUnidadeFederativa: 33, NomeUnidadeFederativa: "RJ" },
      ];

      Municipio.find.mockResolvedValue([
        {
          ...municipioMock[0],
          toObject: () => municipioMock[0],
        },
        {
          ...municipioMock[1],
          toObject: () => municipioMock[1],
        },
      ]);
      UnidadeFederativa.findOne
        .mockResolvedValueOnce(unidadeFederativaMock[0])
        .mockResolvedValueOnce(unidadeFederativaMock[1]);

      const result = await getAllMunicipios();

      expect(result).toEqual([
        {
          ...municipioMock[0],
          unidadeFederativa: unidadeFederativaMock[0],
        },
        {
          ...municipioMock[1],
          unidadeFederativa: unidadeFederativaMock[1],
        },
      ]);
      expect(Municipio.find).toHaveBeenCalledWith({});
    });
  });
});
