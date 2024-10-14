import {
  createViagem,
  getViagemById,
  getViagensByEmpregadoId,
  updateViagem,
  deleteViagem,
} from "../services/viagemService";
import Viagem from "../models/Viagem";
import DestinoViagem from "../models/DestinoViagem";
import CustoDestino from "../models/CustoDestino";
import Empregado from "../models/Empregado";
import Municipio from "../models/Municipio";
import StatusViagem from "../models/StatusViagem";
import UnidadeFederativa from "../models/UnidadeFederativa";
import { fileURLToPath } from "url";
import path from "path";

// Simular o comportamento de `fileURLToPath` e `path`
jest.mock("url", () => ({
  fileURLToPath: jest.fn().mockReturnValue("/path/to/file.js"),
}));

jest.mock("path", () => ({
  dirname: jest.fn((p) => p.replace(/\/[^/]*$/, "")), // Simular dirname de um arquivo
  resolve: jest.fn((...args) => args.join("/")), // Resolver caminho de arquivo simulando um comportamento básico
}));

// Mock dos modelos
jest.mock("../models/Viagem");
jest.mock("../models/DestinoViagem");
jest.mock("../models/CustoDestino");
jest.mock("../models/Empregado");
jest.mock("../models/Municipio");
jest.mock("../models/StatusViagem");
jest.mock("../models/UnidadeFederativa");

describe("Serviço de Viagem", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createViagem", () => {
    it("deve criar uma nova viagem com sucesso", async () => {
      const dados = {
        idEmpregado: 1,
        idMunicipioSaida: 100,
        DataInicioViagem: new Date(),
        DataTerminoViagem: new Date(),
        destinos: [
          {
            idMunicipioDestino: 200,
            DataDestinoViagem: new Date(),
            custo: {
              idTipoCusto: 1,
              ValorCustoDestino: 500,
            },
          },
        ],
      };

      Viagem.findOne.mockResolvedValue(null); // Nenhuma viagem em andamento
      Viagem.prototype.save.mockResolvedValue({ idViagem: 1 }); // Mock da criação da viagem
      DestinoViagem.prototype.save.mockResolvedValue({ idDestinoViagem: 1 }); // Mock do destino
      CustoDestino.prototype.save.mockResolvedValue({ idCustoDestino: 1 }); // Mock do custo

      const viagemCriada = {
        idViagem: 1,
        empregado: "Teste",
        municipioSaida: {
          nome: "Saída",
          unidadeFederativa: { NomeUnidadeFederativa: "UF" },
        },
        DataInicioViagem: dados.DataInicioViagem,
        DataTerminoViagem: dados.DataTerminoViagem,
        destinos: [
          {
            municipioDestino: "Destino",
            unidadeFederativaDestino: { NomeUnidadeFederativa: "UF" },
            DataDestinoViagem: dados.destinos[0].DataDestinoViagem,
            custos: [
              {
                NomeTipoCusto: "Hospedagem",
                ValorCustoDestino: 500,
              },
            ],
          },
        ],
        statusViagem: "Pendente",
      };

      const result = await createViagem(dados);

      expect(result).toEqual(viagemCriada);
      expect(Viagem.findOne).toHaveBeenCalled();
      expect(Viagem.prototype.save).toHaveBeenCalled();
      expect(DestinoViagem.prototype.save).toHaveBeenCalled();
      expect(CustoDestino.prototype.save).toHaveBeenCalled();
    });

    it("deve lançar um erro se o empregado já tiver uma viagem em andamento", async () => {
      const dados = {
        idEmpregado: 1,
        DataInicioViagem: new Date(),
        DataTerminoViagem: new Date(),
        destinos: [],
      };

      Viagem.findOne.mockResolvedValue({ idViagem: 1 }); // Viagem em andamento

      await expect(createViagem(dados)).rejects.toThrow(
        "Já existe uma viagem em andamento ou com intervalo menor que uma semana."
      );
    });
  });

  describe("getViagemById", () => {
    it("deve retornar a viagem pelo ID", async () => {
      const viagemMock = {
        idViagem: 1,
        idEmpregado: 1,
        idMunicipioSaida: 100,
        DataInicioViagem: new Date(),
        DataTerminoViagem: new Date(),
        destinos: [{ idDestinoViagem: 1 }],
      };

      Viagem.findOne.mockResolvedValue(viagemMock);
      StatusViagem.findOne.mockResolvedValue({ NomeStatusViagem: "Pendente" });
      Empregado.findOne.mockResolvedValue({ nomeEmpregado: "Teste" });
      Municipio.findOne.mockResolvedValue({
        NomeMunicipio: "Saída",
        idUnidadeFederativa: 1,
      });
      UnidadeFederativa.findOne.mockResolvedValue({
        NomeUnidadeFederativa: "UF",
      });
      DestinoViagem.find.mockResolvedValue([
        { idDestinoViagem: 1, idMunicipioDestino: 200 },
      ]);
      CustoDestino.find.mockResolvedValue([
        { idCustoDestino: 1, idTipoCusto: 1, ValorCustoDestino: 500 },
      ]);
      TipoCusto.findOne.mockResolvedValue({ NomeTipoCusto: "Hospedagem" });

      const viagem = await getViagemById(1);

      expect(viagem.idViagem).toBe(1);
      expect(viagem.statusViagem).toBe("Pendente");
      expect(viagem.empregado).toBe("Teste");
    });

    it("deve lançar um erro se a viagem não for encontrada", async () => {
      Viagem.findOne.mockResolvedValue(null);

      await expect(getViagemById(1)).rejects.toThrow("Viagem não encontrada.");
    });
  });

  describe("getViagensByEmpregadoId", () => {
    it("deve retornar todas as viagens do empregado", async () => {
      const viagemMock = [
        {
          idViagem: 1,
          DataInicioViagem: new Date(),
          DataTerminoViagem: new Date(),
          idMunicipioSaida: 100,
        },
      ];

      Viagem.find.mockResolvedValue(viagemMock);
      Empregado.findOne.mockResolvedValue({ nomeEmpregado: "Teste" });
      Municipio.findOne.mockResolvedValue({
        NomeMunicipio: "Saída",
        idUnidadeFederativa: 1,
      });
      UnidadeFederativa.findOne.mockResolvedValue({
        NomeUnidadeFederativa: "UF",
      });
      DestinoViagem.find.mockResolvedValue([
        { idDestinoViagem: 1, idMunicipioDestino: 200 },
      ]);
      CustoDestino.find.mockResolvedValue([
        { idCustoDestino: 1, idTipoCusto: 1, ValorCustoDestino: 500 },
      ]);
      TipoCusto.findOne.mockResolvedValue({ NomeTipoCusto: "Hospedagem" });

      const viagens = await getViagensByEmpregadoId(1);

      expect(viagens.nomeEmpregado).toBe("Teste");
      expect(viagens.viagens.length).toBe(1);
    });

    it("deve lançar um erro se nenhuma viagem for encontrada", async () => {
      Viagem.find.mockResolvedValue([]);

      await expect(getViagensByEmpregadoId(1)).rejects.toThrow(
        "Nenhuma viagem encontrada para esse empregado."
      );
    });
  });

  describe("updateViagem", () => {
    it("deve atualizar uma viagem com sucesso", async () => {
      const dadosAtualizados = {
        idEmpregado: 1,
        DataInicioViagem: new Date(),
        DataTerminoViagem: new Date(),
        destinos: [
          {
            idDestinoViagem: 1,
            idMunicipioDestino: 200,
            DataDestinoViagem: new Date(),
            custo: {
              idTipoCusto: 1,
              ValorCustoDestino: 500,
            },
          },
        ],
      };

      Viagem.findOneAndUpdate.mockResolvedValue(dadosAtualizados);
      DestinoViagem.findOneAndUpdate.mockResolvedValue({ idDestinoViagem: 1 });
      CustoDestino.findOneAndUpdate.mockResolvedValue({ idCustoDestino: 1 });

      const result = await updateViagem(1, dadosAtualizados);

      expect(result).toEqual(dadosAtualizados);
      expect(Viagem.findOneAndUpdate).toHaveBeenCalled();
    });

    it("deve lançar um erro se a viagem não for encontrada para atualização", async () => {
      Viagem.findOneAndUpdate.mockResolvedValue(null);

      await expect(updateViagem(1, {})).rejects.toThrow(
        "Viagem não encontrada."
      );
    });
  });

  describe("deleteViagem", () => {
    it("deve excluir uma viagem com sucesso", async () => {
      Viagem.findOneAndDelete.mockResolvedValue({ idViagem: 1 });
      DestinoViagem.find.mockResolvedValue([{ idDestinoViagem: 1 }]);
      CustoDestino.deleteMany.mockResolvedValue({});
      DestinoViagem.findOneAndDelete.mockResolvedValue({});

      const result = await deleteViagem(1);

      expect(result.message).toBe("Viagem excluída com sucesso");
      expect(Viagem.findOneAndDelete).toHaveBeenCalled();
    });

    it("deve lançar um erro se a viagem não for encontrada para exclusão", async () => {
      Viagem.findOneAndDelete.mockResolvedValue(null);

      await expect(deleteViagem(1)).rejects.toThrow("Viagem não encontrada.");
    });
  });
});
