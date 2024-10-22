import Viagem from "../models/Viagem.js";
import DestinoViagem from "../models/DestinoViagem.js";
import CustoDestino from "../models/CustoDestino.js";
import Municipio from "../models/Municipio.js";
import Empregado from "../models/Empregado.js";
import StatusViagem from "../models/StatusViagem.js";
import UnidadeFederativa from "../models/UnidadeFederativa.js";
import TipoCusto from "../models/TipoCusto.js";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import PDFDocument from "pdfkit";

// Criar uma nova viagem

export const createViagem = async (data) => {
  try {
    const {
      idEmpregado,
      idMunicipioSaida,
      DataInicioViagem,
      DataTerminoViagem,
      destinos,
    } = data;

    // 1. Verificar se o empregado já tem uma viagem em andamento (status 2)
    const viagemEmAndamento = await Viagem.findOne({
      idEmpregado,
      idStatusViagem: 2,
    });

    const umaSemanaEmMilissegundos = 7 * 24 * 60 * 60 * 1000;
    // Se encontrar uma viagem com status 2, bloquear a criação
    if (viagemEmAndamento) {
      const dataTerminoViagemAndamento = new Date(
        viagemEmAndamento.DataTerminoViagem
      ).getTime();
      const dataInicioNovaViagem = new Date(DataInicioViagem).getTime();

      // Verificar se a nova viagem começa dentro do intervalo de 1 semana após o término da viagem em andamento
      if (
        dataInicioNovaViagem <=
        dataTerminoViagemAndamento + umaSemanaEmMilissegundos
      ) {
        throw new Error(
          "Já existe uma viagem em andamento, e a nova viagem deve começar pelo menos 1 semana após o término da viagem em andamento."
        );
      }
    }

    // 2. Criar a viagem principal
    const novaViagem = new Viagem({
      idEmpregado,
      idMunicipioSaida,
      idStatusViagem: 1,
      DataInicioViagem,
      DataTerminoViagem,
    });

    await novaViagem.save();

    // 3. Criar os destinos e seus respectivos custos
    for (const destino of destinos) {
      const { idMunicipioDestino, DataDestinoViagem, custos } = destino;

      // Criar o destino da viagem
      const novoDestino = new DestinoViagem({
        idViagem: novaViagem.idViagem,
        idMunicipioDestino,
        DataDestinoViagem,
      });

      await novoDestino.save();

      // Se o destino tiver uma lista de custos, salvar cada um
      if (custos && custos.length > 0) {
        for (const custo of custos) {
          const { idTipoCusto, ValorCustoDestino } = custo;

          const novoCusto = new CustoDestino({
            idDestinoViagem: novoDestino.idDestinoViagem,
            idTipoCusto,
            ValorCustoDestino,
          });

          await novoCusto.save();
        }
      }
    }

    // 4. Retornar a viagem criada com os destinos e custos no formato solicitado
    const viagemCriada = {
      idViagem: novaViagem.idViagem,
      idEmpregado: novaViagem.idEmpregado,
      idUnidadeFederativa: novaViagem.idUnidadeFederativa,
      idMunicipioSaida: novaViagem.idMunicipioSaida,
      idStatusViagem: novaViagem.idStatusViagem,
      DataInicioViagem: novaViagem.DataInicioViagem,
      DataTerminoViagem: novaViagem.DataTerminoViagem,
      destinos: await Promise.all(
        destinos.map(async (destino) => {
          const novoDestino = await DestinoViagem.findOne({
            idViagem: novaViagem.idViagem,
            idMunicipioDestino: destino.idMunicipioDestino,
          });

          const custos = await CustoDestino.find({
            idDestinoViagem: novoDestino.idDestinoViagem,
          });

          return {
            idUnidadeFederativa: novoDestino.idMunicipioDestino,
            idMunicipioDestino: novoDestino.idMunicipioDestino,
            data: novoDestino.DataDestinoViagem,
            custos: custos.map((custo) => ({
              idTipoCusto: custo.idTipoCusto,
              valor: custo.ValorCustoDestino,
            })),
          };
        })
      ),
    };

    return viagemCriada;
  } catch (error) {
    throw new Error(`Erro ao criar viagem: ${error.message}`);
  }
};

export const getViagemById = async (idViagem) => {
  try {
    // 1. Buscar a viagem principal
    const viagem = await Viagem.findOne({ idViagem });
    if (!viagem) {
      return {
        idViagem: null,
        idEmpregado: null,
        unidadeFederativaId: null,
        idMunicipioSaida: null,
        idStatusViagem: null,
        DataInicioViagem: null,
        DataTerminoViagem: null,
        usuario: {
          idEmpregado: null,
          nomeEmpregado: "Empregado não encontrado",
        },
        destinos: [],
      };
    }

    // 2. Buscar o empregado associado à viagem
    const empregado = await Empregado.findOne({
      idEmpregado: viagem.idEmpregado,
    });
    const usuario = {
      idEmpregado: empregado ? empregado.idEmpregado : null,
      nomeEmpregado: empregado
        ? empregado.nomeEmpregado
        : "Empregado não encontrado",
    };

    // 3. Buscar o município de saída e unidade federativa associados à viagem
    const municipioSaida = await Municipio.findOne({
      idMunicipio: viagem.idMunicipioSaida,
    });
    const unidadeFederativaSaida = municipioSaida
      ? await UnidadeFederativa.findOne({
          idUnidadeFederativa: municipioSaida.idUnidadeFederativa,
        })
      : null;

    const idMunicipioSaida = municipioSaida ? municipioSaida.idMunicipio : null;
    const unidadeFederativaId = unidadeFederativaSaida
      ? unidadeFederativaSaida.idUnidadeFederativa
      : null;

    // 4. Buscar o status da viagem
    const statusViagem = await StatusViagem.findOne({
      idStatusViagem: viagem.idStatusViagem,
    });
    const nomeStatusViagem = statusViagem
      ? statusViagem.NomeStatusViagem
      : "Status da viagem não encontrado";

    // 5. Buscar os destinos da viagem
    const destinos = await DestinoViagem.find({ idViagem });

    const destinosTratados = await Promise.all(
      destinos.map(async (destino) => {
        const municipioDestino = await Municipio.findOne({
          idMunicipio: destino.idMunicipioDestino,
        });
        const unidadeFederativaDestino = municipioDestino
          ? await UnidadeFederativa.findOne({
              idUnidadeFederativa: municipioDestino.idUnidadeFederativa,
            })
          : null;

        const custos = await CustoDestino.find({
          idDestinoViagem: destino.idDestinoViagem,
        });

        const custosTratados = await Promise.all(
          custos.map(async (custo) => {
            const tipoCusto = await TipoCusto.findOne({
              idTipoCusto: custo.idTipoCusto,
            });
            return {
              idTipoCusto: tipoCusto?.idTipoCusto || null,
              NomeTipoCusto: tipoCusto?.NomeTipoCusto || "Desconhecido",
              ValorCustoDestino: custo.ValorCustoDestino,
            };
          })
        );

        return {
          idViagem: destino.idViagem,
          idUnidadeFederativa: unidadeFederativaDestino
            ? unidadeFederativaDestino.idUnidadeFederativa
            : null,
          idMunicipioDestino: municipioDestino
            ? municipioDestino.idMunicipio
            : null,
          DataDestinoViagem: destino.DataDestinoViagem,
          municipio: {
            idMunicipio: municipioDestino ? municipioDestino.idMunicipio : null,
            NomeMunicipio: municipioDestino
              ? municipioDestino.NomeMunicipio
              : "Município de destino não encontrado",
          },
          unidadeFederativa: {
            idUnidadeFederativa: unidadeFederativaDestino
              ? unidadeFederativaDestino.idUnidadeFederativa
              : null,
            NomeUnidadeFederativa: unidadeFederativaDestino
              ? unidadeFederativaDestino.NomeUnidadeFederativa
              : "UF não encontrada",
          },
          custos: custosTratados,
        };
      })
    );

    // 6. Retornar a estrutura ajustada da viagem
    return {
      idViagem: viagem.idViagem,
      idEmpregado: viagem.idEmpregado,
      unidadeFederativaId: unidadeFederativaId,
      idMunicipioSaida: idMunicipioSaida,
      NomeMunicipioSaida: municipioSaida
        ? municipioSaida.NomeMunicipio
        : "Município de saída não encontrado",
      NomeUnidadeFederativaSaida: unidadeFederativaSaida
        ? unidadeFederativaSaida.NomeUnidadeFederativa
        : "UF de saída não encontrada",
      idStatusViagem: viagem.idStatusViagem,
      NomeStatusViagem: nomeStatusViagem,
      DataInicioViagem: viagem.DataInicioViagem,
      DataTerminoViagem: viagem.DataTerminoViagem,
      usuario: usuario,
      destinos: destinosTratados,
    };
  } catch (error) {
    return {
      idViagem: null,
      idEmpregado: null,
      unidadeFederativaId: null,
      idMunicipioSaida: null,
      idStatusViagem: null,
      DataInicioViagem: null,
      DataTerminoViagem: null,
      usuario: {
        idEmpregado: null,
        nomeEmpregado: "Erro ao buscar viagem",
      },
      destinos: [],
    };
  }
};

export const getViagensByEmpregadoId = async (idEmpregado) => {
  try {
    // 1. Buscar todas as viagens associadas ao empregado
    const viagens = await Viagem.find({ idEmpregado });

    // Retornar uma lista vazia se nenhuma viagem for encontrada
    if (!viagens || viagens.length === 0) {
      return {
        viagens: [],
      };
    }

    // 2. Buscar o empregado associado
    const empregado = await Empregado.findOne({ idEmpregado });

    const usuario = {
      idEmpregado: empregado ? empregado.idEmpregado : null,
      nomeEmpregado: empregado
        ? empregado.nomeEmpregado
        : "Empregado não encontrado",
    };

    // 3. Processar cada viagem
    const viagensTratadas = await Promise.all(
      viagens.map(async (viagem) => {
        // Buscar o status da viagem
        const statusViagem = await StatusViagem.findOne({
          idStatusViagem: viagem.idStatusViagem,
        });
        const nomeStatusViagem = statusViagem
          ? statusViagem.NomeStatusViagem
          : "Status da viagem não encontrado";

        // Buscar o município de saída e a unidade federativa
        const municipioSaida = await Municipio.findOne({
          idMunicipio: viagem.idMunicipioSaida,
        });
        const unidadeFederativaSaida = municipioSaida
          ? await UnidadeFederativa.findOne({
              idUnidadeFederativa: municipioSaida.idUnidadeFederativa,
            })
          : null;

        const nomeMunicipioSaida = municipioSaida
          ? municipioSaida.NomeMunicipio
          : "Município de saída não encontrado";
        const unidadeFederativaIdSaida = unidadeFederativaSaida
          ? unidadeFederativaSaida.idUnidadeFederativa
          : null;
        const nomeUnidadeFederativaSaida = unidadeFederativaSaida
          ? unidadeFederativaSaida.NomeUnidadeFederativa
          : "UF não encontrada";

        // Buscar os destinos da viagem
        const destinos = await DestinoViagem.find({
          idViagem: viagem.idViagem,
        });

        // Tratar cada destino
        const destinosTratados = await Promise.all(
          destinos.map(async (destino) => {
            const municipioDestino = await Municipio.findOne({
              idMunicipio: destino.idMunicipioDestino,
            });
            const unidadeFederativaDestino = municipioDestino
              ? await UnidadeFederativa.findOne({
                  idUnidadeFederativa: municipioDestino.idUnidadeFederativa,
                })
              : null;

            const nomeMunicipioDestino = municipioDestino
              ? municipioDestino.NomeMunicipio
              : "Município de destino não encontrado";
            const unidadeFederativaIdDestino = unidadeFederativaDestino
              ? unidadeFederativaDestino.idUnidadeFederativa
              : null;
            const nomeUnidadeFederativaDestino = unidadeFederativaDestino
              ? unidadeFederativaDestino.NomeUnidadeFederativa
              : "UF não encontrada";

            const custos = await CustoDestino.find({
              idDestinoViagem: destino.idDestinoViagem,
            });

            const custosTratados = await Promise.all(
              custos.map(async (custo) => {
                const tipoCusto = await TipoCusto.findOne({
                  idTipoCusto: custo.idTipoCusto,
                });

                return {
                  idTipoCusto: tipoCusto?.idTipoCusto || null,
                  NomeTipoCusto: tipoCusto?.NomeTipoCusto || "Desconhecido",
                  ValorCustoDestino: custo.ValorCustoDestino,
                };
              })
            );

            return {
              idViagem: destino.idViagem,
              idMunicipioDestino: municipioDestino
                ? municipioDestino.idMunicipio
                : null,
              idUnidadeFederativa: unidadeFederativaDestino
                ? unidadeFederativaDestino.idUnidadeFederativa
                : null,
              DataDestinoViagem: destino.DataDestinoViagem,
              municipio: {
                idMunicipio: municipioDestino
                  ? municipioDestino.idMunicipio
                  : null,
                NomeMunicipio: nomeMunicipioDestino,
              },
              unidadeFederativa: {
                idUnidadeFederativa: unidadeFederativaDestino
                  ? unidadeFederativaDestino.idUnidadeFederativa
                  : null,
                NomeUnidadeFederativa: nomeUnidadeFederativaDestino,
              },
              custos: custosTratados,
            };
          })
        );

        // Retornar os dados da viagem processada
        return {
          idViagem: viagem.idViagem,
          NomeStatusViagem: nomeStatusViagem,
          DataInicioViagem: viagem.DataInicioViagem,
          DataTerminoViagem: viagem.DataTerminoViagem,
          municipioSaida: {
            idMunicipioSaida: municipioSaida
              ? municipioSaida.idMunicipio
              : null,
            NomeMunicipioSaida: nomeMunicipioSaida,
            idUnidadeFederativa: unidadeFederativaIdSaida,
            NomeUnidadeFederativaSaida: nomeUnidadeFederativaSaida,
          },
          destinos: destinosTratados,
        };
      })
    );

    // 4. Retornar as viagens processadas com os dados do empregado
    return {
      usuario,
      viagens: viagensTratadas,
    };
  } catch (error) {
    // Em caso de erro, retorna uma lista vazia e uma mensagem padrão
    return {
      usuario: {
        idEmpregado: null,
        nomeEmpregado: "Erro ao buscar viagens",
      },
      viagens: [],
    };
  }
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Função para formatar datas no padrão brasileiro
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("pt-BR");
};

export const exportViagemToPdf = async (idViagem, res) => {
  try {
    const viagem = await getViagemById(idViagem);

    if (!viagem) {
      throw new Error("Viagem não encontrada.");
    }

    const doc = new PDFDocument({
      margin: 40,
      size: "A4",
    });

    // Configura o cabeçalho da resposta para PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=viagem_${idViagem}.pdf`
    );

    // Pipe do PDF diretamente para a resposta
    doc.pipe(res);

    // Definir cores do layout
    const headerColor = "#004080";
    const primaryColor = "#007ACC";
    const backgroundColor = "#E3F2FD";
    const lightGray = "#F5F5F5";
    const darkGray = "#4A4A4A"; // Texto escuro para contraste

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Definir nova fonte
    doc.font("Helvetica");

    // Cabeçalho - Centralizado
    doc
      .image(path.join(__dirname, "../utils/icons/airplane-1755.png"), 40, 20, {
        width: 50,
      })
      .fillColor(headerColor)
      .fontSize(24)
      .text("Comprovante de Viagem", { align: "center" })
      .fontSize(12)
      .fillColor(primaryColor)
      .text("Seu comprovante oficial de viagem", { align: "center" })
      .moveDown(1.5);

    // Informações do Viajante - Seção de Cabeçalho
    doc
      .fillColor(headerColor)
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("Informações do Viajante", { align: "left" })
      .moveDown(0.5);

    // Caixa de informações do viajante
    doc
      .roundedRect(40, doc.y, 520, 70, 10)
      .fill(lightGray)
      .stroke()
      .moveDown(1)
      .fontSize(12)
      .fillColor(darkGray) // Texto mais escuro para melhorar o contraste
      .text(`Nome: ${viagem.usuario.nomeEmpregado}`, 50, doc.y + 10)
      .text(
        `Município de Saída: ${viagem.NomeMunicipioSaida}, ${viagem.NomeUnidadeFederativaSaida}`,
        50,
        doc.y + 30
      )
      .text(`Status da Viagem: ${viagem.NomeStatusViagem}`, 50, doc.y + 50)
      .moveDown(2);

    // Detalhes da Viagem
    doc
      .fillColor(headerColor)
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("Detalhes da Viagem", { align: "left" })
      .moveDown(0.5);

    doc
      .roundedRect(40, doc.y, 520, 60, 10)
      .fill(lightGray)
      .stroke()
      .moveDown(1)
      .fillColor(darkGray)
      .fontSize(12)
      .text(
        `Data de Partida: ${formatDate(viagem.DataInicioViagem)}`,
        50,
        doc.y + 10
      )
      .text(
        `Data de Chegada: ${formatDate(viagem.DataTerminoViagem)}`,
        50,
        doc.y + 30
      )
      .moveDown(2);

    // Destinos
    doc
      .fillColor(headerColor)
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("Destinos", { align: "left" })
      .moveDown(1);

    viagem.destinos.forEach((destino, index) => {
      // Caixa de destino
      doc
        .roundedRect(40, doc.y, 520, 90, 10)
        .fill(backgroundColor)
        .stroke()
        .moveDown(1)
        .fillColor(darkGray)
        .fontSize(12)
        .text(
          `Destino ${index + 1}: ${destino.municipio.NomeMunicipio}, ${
            destino.unidadeFederativa.NomeUnidadeFederativa
          }`,
          50,
          doc.y + 10
        )
        .text(
          `Data de Chegada: ${formatDate(destino.DataDestinoViagem)}`,
          50,
          doc.y + 30
        )
        .moveDown(1);

      // Se há custos, exibi-los
      if (destino.custos && destino.custos.length > 0) {
        doc
          .fontSize(12)
          .fillColor(primaryColor)
          .text("Custos:", { align: "left" })
          .moveDown(0.5);

        destino.custos.forEach((custo) => {
          doc
            .fontSize(12)
            .fillColor(darkGray)
            .text(`- Tipo de Custo: ${custo.NomeTipoCusto}`)
            .text(
              `- Valor: ${formatCurrency(custo.ValorCustoDestino).toString()}`
            )
            .moveDown(0.5);
        });
      }
    });

    // Rodapé - Centralizado
    doc
      .moveDown(3)
      .fontSize(12)
      .fillColor(headerColor)
      .text("Emitido por:", { align: "center" })
      .moveDown(0.5)
      .font("Helvetica")
      .fillColor(darkGray)
      .text("Sistema de Gestão de Viagens", { align: "center" })
      .moveDown(0.3)
      .text(`Número do comprovante: ${viagem.idViagem}`, { align: "center" })
      .moveDown(1.5);

    // Finaliza o PDF
    doc.end();
  } catch (error) {
    console.error(`Erro ao exportar viagem para PDF: ${error.message}`);
    res.status(500).send("Erro ao exportar viagem para PDF.");
  }
};

// Atualizar uma viagem
export const updateViagem = async (idViagem, data) => {
  try {
    // 1. Buscar os dados da viagem existente
    const viagemExistente = await getViagemById(idViagem);

    if (!viagemExistente) {
      throw new Error("Viagem não encontrada.");
    }

    const {
      idEmpregado = viagemExistente.idEmpregado,
      idMunicipioSaida = viagemExistente.idMunicipioSaida,
      idUnidadeFederativa = viagemExistente.idUnidadeFederativa,
      idStatusViagem = viagemExistente.idStatusViagem,
      DataInicioViagem = viagemExistente.DataInicioViagem,
      DataTerminoViagem = viagemExistente.DataTerminoViagem,
      destinos = data.destinos || [], // Destinos novos ou atualizados
    } = data;

    // 2. Atualizar a viagem principal apenas se os dados forem diferentes
    if (
      idEmpregado !== viagemExistente.idEmpregado ||
      idMunicipioSaida !== viagemExistente.idMunicipioSaida ||
      idUnidadeFederativa !== viagemExistente.idUnidadeFederativa ||
      idStatusViagem !== viagemExistente.idStatusViagem ||
      DataInicioViagem !== viagemExistente.DataInicioViagem ||
      DataTerminoViagem !== viagemExistente.DataTerminoViagem
    ) {
      await Viagem.findOneAndUpdate(
        { idViagem },
        {
          idEmpregado,
          idMunicipioSaida,
          idUnidadeFederativa,
          idStatusViagem,
          DataInicioViagem,
          DataTerminoViagem,
        },
        { new: true }
      );
    }

    // 3. Atualizar destinos e custos
    // Obter destinos existentes
    const destinosExistentes = await DestinoViagem.find({ idViagem });
    const destinosExistentesMap = new Map();
    destinosExistentes.forEach((destino) => {
      destinosExistentesMap.set(destino.idDestinoViagem.toString(), destino);
    });

    // Processar destinos recebidos
    for (const destino of destinos) {
      const {
        idDestinoViagem,
        idMunicipioDestino,
        idUnidadeFederativa: destinoUnidadeFederativa,
        DataDestinoViagem,
        custos = [],
      } = destino;

      let destinoAtualizado;

      if (
        idDestinoViagem &&
        destinosExistentesMap.has(idDestinoViagem.toString())
      ) {
        // Atualizar destino existente
        destinoAtualizado = await DestinoViagem.findOneAndUpdate(
          { idDestinoViagem },
          {
            idMunicipioDestino,
            idUnidadeFederativa: destinoUnidadeFederativa,
            DataDestinoViagem,
          },
          { new: true }
        );
        destinosExistentesMap.delete(idDestinoViagem.toString());
      } else {
        // Criar novo destino
        destinoAtualizado = await DestinoViagem.create({
          idViagem,
          idMunicipioDestino,
          idUnidadeFederativa: destinoUnidadeFederativa,
          DataDestinoViagem,
        });
      }

      // Atualizar custos
      const custosExistentes = await CustoDestino.find({
        idDestinoViagem: destinoAtualizado.idDestinoViagem,
      });
      const custosExistentesMap = new Map();
      custosExistentes.forEach((custo) => {
        custosExistentesMap.set(custo.idCustoDestino.toString(), custo);
      });

      for (const custo of custos) {
        const { idCustoDestino, idTipoCusto, ValorCustoDestino } = custo;

        if (
          idCustoDestino &&
          custosExistentesMap.has(idCustoDestino.toString())
        ) {
          // Atualizar custo existente
          await CustoDestino.findOneAndUpdate(
            { idCustoDestino },
            {
              idTipoCusto,
              ValorCustoDestino: ValorCustoDestino.toString(),
            },
            { new: true }
          );
          custosExistentesMap.delete(idCustoDestino.toString());
        } else {
          // Criar novo custo
          await CustoDestino.create({
            idDestinoViagem: destinoAtualizado.idDestinoViagem,
            idTipoCusto,
            ValorCustoDestino: ValorCustoDestino.toString(),
          });
        }
      }

      // Deletar custos que não estão mais presentes
      for (const custo of custosExistentesMap.values()) {
        await CustoDestino.deleteOne({ idCustoDestino: custo.idCustoDestino });
      }
    }

    // Deletar destinos que não estão mais presentes
    for (const destino of destinosExistentesMap.values()) {
      // Deletar custos associados
      await CustoDestino.deleteMany({
        idDestinoViagem: destino.idDestinoViagem,
      });
      // Deletar destino
      await DestinoViagem.deleteOne({
        idDestinoViagem: destino.idDestinoViagem,
      });
    }

    // 4. Retornar os dados atualizados da viagem
    const viagemAtualizada = await getViagemById(idViagem);

    return viagemAtualizada;
  } catch (error) {
    throw new Error(`Erro ao atualizar viagem: ${error.message}`);
  }
};

// Função para aprovar uma viagem
export const approveViagem = async (idViagem) => {
  try {
    // 1. Buscar a viagem existente
    const viagemExistente = await getViagemById(idViagem);

    if (!viagemExistente) {
      throw new Error("Viagem não encontrada.");
    }

    // 2. Atualizar o idStatusViagem para 2 (aprovado)
    await Viagem.findOneAndUpdate(
      { idViagem },
      { idStatusViagem: 2 },
      { new: true }
    );

    return;
  } catch (error) {
    throw new Error(`Erro ao aprovar viagem: ${error.message}`);
  }
};

// Função para reprovar uma viagem
export const disapproveViagem = async (idViagem) => {
  try {
    // 1. Buscar a viagem existente
    const viagemExistente = await getViagemById(idViagem);

    if (!viagemExistente) {
      throw new Error("Viagem não encontrada.");
    }

    // 2. Atualizar o idStatusViagem para 3 (reprovado)
    await Viagem.findOneAndUpdate(
      { idViagem },
      { idStatusViagem: 3 },
      { new: true }
    );

    return;
  } catch (error) {
    throw new Error(`Erro ao reprovar viagem: ${error.message}`);
  }
};

// Excluir uma viagem e seus destinos/custos relacionados
export const deleteViagem = async (idViagem) => {
  try {
    // 1. Excluir a viagem principal
    const viagem = await Viagem.findOneAndDelete({ idViagem: idViagem });

    if (!viagem) {
      throw new Error("Viagem não encontrada.");
    }

    // 2. Excluir os destinos da viagem
    const destinos = await DestinoViagem.find({ idDestinoViagem: idViagem });

    for (const destino of destinos) {
      // Excluir custos relacionados ao destino
      await CustoDestino.deleteMany({
        idDestinoViagem: destino.idDestinoViagem,
      });

      // Excluir o destino
      await DestinoViagem.findOneAndDelete({
        idDestinoViagem: destino.idDestinoViagem,
      });
    }

    return { message: "Viagem excluída com sucesso" };
  } catch (error) {
    throw new Error(`Erro ao excluir viagem: ${error.message}`);
  }
};
