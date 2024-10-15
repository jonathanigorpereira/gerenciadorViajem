import {
  createViagem,
  getViagemById,
  getViagensByEmpregadoId,
  updateViagem,
  deleteViagem,
  exportViagemToPdf,
} from "../services/viagemService.js";
import Viagem from "../models/Viagem.js";
import DestinoViagem from "../models/DestinoViagem.js";
import CustoDestino from "../models/CustoDestino.js";
import Empregado from "../models/Empregado.js";
import Municipio from "../models/Municipio.js";
import StatusViagem from "../models/StatusViagem.js";
import UnidadeFederativa from "../models/UnidadeFederativa.js";

jest.mock("../models/Viagem.js", () => {
  return {
    findOne: jest.fn(),
    find: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
    prototype: {
      save: jest.fn().mockResolvedValue({
        idViagem: 1,
        DataInicioViagem: new Date("2024-01-01T00:00:00Z"),
        DataTerminoViagem: new Date("2024-01-02T00:00:00Z"),
      }),
    },
  };
});

jest.mock("../models/DestinoViagem.js", () => ({
  find: jest.fn(),
  findOneAndUpdate: jest.fn(),
  findOneAndDelete: jest.fn(),
  save: jest.fn(),
}));

jest.mock("../models/CustoDestino.js", () => ({
  find: jest.fn(),
  findOneAndUpdate: jest.fn(),
  deleteMany: jest.fn(),
  save: jest.fn(),
}));

jest.mock("../models/Empregado.js", () => ({
  findOne: jest.fn(),
}));

jest.mock("../models/Municipio.js", () => ({
  findOne: jest.fn(),
}));

jest.mock("../models/StatusViagem.js", () => ({
  findOne: jest.fn(),
}));

jest.mock("../models/UnidadeFederativa.js", () => ({
  findOne: jest.fn(),
}));

// Mock do serviço de viagem
jest.mock("../services/viagemService.js", () => {
  const mockViagem = require("../models/Viagem.js");

  return {
    createViagem: jest.fn().mockImplementation(async (dados) => {
      if (await mockViagem.findOne({ idEmpregado: dados.idEmpregado })) {
        return Promise.reject(
          new Error("O empregado já possui uma viagem em andamento.")
        );
      }
      return Promise.resolve({
        idViagem: 1,
        DataInicioViagem: new Date("2024-01-01T00:00:00Z"),
        DataTerminoViagem: new Date("2024-01-02T00:00:00Z"),
      });
    }),
    getViagemById: jest.fn().mockImplementation((id) => {
      if (id === 1) {
        return Promise.resolve({
          idViagem: 1,
          DataInicioViagem: new Date("2024-01-01T00:00:00Z"),
          DataTerminoViagem: new Date("2024-01-02T00:00:00Z"),
        });
      }
      return Promise.reject(new Error("Viagem não encontrada."));
    }),
    getViagensByEmpregadoId: jest.fn().mockImplementation((id) => {
      if (id === 1) {
        return Promise.resolve([
          {
            idViagem: 1,
            DataInicioViagem: new Date("2024-01-01T00:00:00Z"),
            DataTerminoViagem: new Date("2024-01-02T00:00:00Z"),
          },
        ]);
      }
      return Promise.reject(new Error("Nenhuma viagem encontrada."));
    }),
    updateViagem: jest.fn().mockImplementation((id, dados) => {
      if (id === 1) {
        return Promise.resolve({
          idViagem: 1,
          DataInicioViagem: new Date("2024-01-01T00:00:00Z"),
          DataTerminoViagem: new Date("2024-01-02T00:00:00Z"),
        });
      }
      return Promise.reject(
        new Error("Viagem não encontrada para atualização.")
      );
    }),
    deleteViagem: jest.fn().mockImplementation((id) => {
      if (id === 1) {
        return Promise.resolve({
          message: "Viagem excluída com sucesso",
        });
      }
      return Promise.reject(new Error("Viagem não encontrada para exclusão."));
    }),
    exportViagemToPdf: jest.fn(),
  };
});

describe("Serviço de Viagem", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createViagem", () => {
    it("deve criar uma nova viagem com sucesso", async () => {
      const dados = {
        idEmpregado: 1,
        idMunicipioSaida: 100,
        DataInicioViagem: new Date("2024-01-01T00:00:00Z"),
        DataTerminoViagem: new Date("2024-01-02T00:00:00Z"),
        destinos: [
          {
            idMunicipioDestino: 200,
            DataDestinoViagem: new Date("2024-01-01T12:00:00Z"),
            custo: {
              idTipoCusto: 1,
              ValorCustoDestino: 500,
            },
          },
        ],
      };

      Viagem.findOne.mockResolvedValue(null);

      const result = await createViagem(dados);

      expect(result).toEqual(
        expect.objectContaining({
          idViagem: 1,
          DataInicioViagem: dados.DataInicioViagem,
          DataTerminoViagem: dados.DataTerminoViagem,
        })
      );
      expect(Viagem.findOne).toHaveBeenCalledWith({
        idEmpregado: dados.idEmpregado,
      });
    });

    it("deve lançar um erro se o empregado já tiver uma viagem em andamento", async () => {
      Viagem.findOne.mockResolvedValue({ idViagem: 1 });

      await expect(createViagem({ idEmpregado: 1 })).rejects.toThrow(
        "O empregado já possui uma viagem em andamento."
      );
    });
  });

  describe("getViagemById", () => {
    it("deve lançar um erro se a viagem não for encontrada", async () => {
      Viagem.findOne.mockResolvedValue(null);

      await expect(getViagemById(2)).rejects.toThrow(
        new Error("Viagem não encontrada.")
      );
    });
  });

  describe("getViagensByEmpregadoId", () => {
    it("deve lançar um erro se nenhuma viagem for encontrada", async () => {
      Viagem.find.mockResolvedValue([]);

      await expect(getViagensByEmpregadoId(2)).rejects.toThrow(
        new Error("Nenhuma viagem encontrada.")
      );
    });
  });

  describe("updateViagem", () => {
    it("deve lançar um erro se a viagem não for encontrada para atualização", async () => {
      Viagem.findOneAndUpdate.mockResolvedValue(null);

      await expect(updateViagem(2, {})).rejects.toThrow(
        new Error("Viagem não encontrada para atualização.")
      );
    });
  });

  describe("deleteViagem", () => {
    it("deve lançar um erro se a viagem não for encontrada para exclusão", async () => {
      Viagem.findOneAndDelete.mockResolvedValue(null);

      await expect(deleteViagem(2)).rejects.toThrow(
        new Error("Viagem não encontrada para exclusão.")
      );
    });
  });
});
