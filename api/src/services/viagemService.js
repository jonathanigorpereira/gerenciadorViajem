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

    // 1. Verificar se o empregado já tem uma viagem em andamento dentro do período ou com intervalo menor que 1 semana
    const umaSemanaEmMilissegundos = 7 * 24 * 60 * 60 * 1000;

    // Buscar viagens que tenham interseção com a nova viagem proposta
    const viagemEmAndamento = await Viagem.findOne({
      idEmpregado,
      $or: [
        // Viagem existente que termina depois do início da nova e começa antes do término
        {
          DataInicioViagem: { $lt: new Date(DataTerminoViagem) },
          DataTerminoViagem: { $gt: new Date(DataInicioViagem) },
        },
        // Viagem existente com menos de 1 semana de intervalo após o término
        {
          DataInicioViagem: {
            $gte: new Date(DataTerminoViagem),
            $lte: new Date(
              new Date(DataTerminoViagem).getTime() + umaSemanaEmMilissegundos
            ),
          },
        },
        // Viagem existente com menos de 1 semana de intervalo antes do início
        {
          DataTerminoViagem: {
            $gte: new Date(
              new Date(DataInicioViagem).getTime() - umaSemanaEmMilissegundos
            ),
            $lt: new Date(DataInicioViagem),
          },
        },
      ],
    });

    // Se existir uma viagem em andamento ou muito próxima, não permitir a criação
    if (viagemEmAndamento) {
      throw new Error(
        "Já existe uma viagem em andamento ou com intervalo menor que uma semana."
      );
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
      const { idMunicipioDestino, DataDestinoViagem, custo } = destino;

      // Criar o destino da viagem
      const novoDestino = new DestinoViagem({
        idViagem: novaViagem.idViagem,
        idMunicipioDestino,
        DataDestinoViagem,
      });

      await novoDestino.save();

      // Se o destino tiver um custo, salvar também
      if (custo) {
        const { idTipoCusto, ValorCustoDestino } = custo;

        const novoCusto = new CustoDestino({
          idDestinoViagem: novoDestino.idDestinoViagem,
          idTipoCusto,
          ValorCustoDestino,
        });

        await novoCusto.save();
      }
    }

    // 4. Retornar a viagem criada com os destinos e custos
    return await getViagemById(novaViagem.idViagem);
  } catch (error) {
    throw new Error(`Erro ao criar viagem: ${error.message}`);
  }
};

export const getViagemById = async (idViagem) => {
  try {
    // 1. Buscar a viagem principal
    const viagem = await Viagem.findOne({ idViagem });

    if (!viagem) {
      throw new Error("Viagem não encontrada.");
    }

    // 2. Buscar o status da viagem
    const statusViagem = await StatusViagem.findOne({
      idStatusViagem: viagem.idStatusViagem,
    });

    const nomeStatusViagem = statusViagem
      ? statusViagem.NomeStatusViagem
      : "Status da viagem não encontrado";

    // 3. Buscar o empregado associado à viagem
    const empregado = await Empregado.findOne({
      idEmpregado: viagem.idEmpregado,
    });

    const nomeEmpregado = empregado
      ? empregado.nomeEmpregado
      : "Empregado não encontrado";

    // 4. Buscar o município de saída associado à viagem
    const municipioSaida = await Municipio.findOne({
      idMunicipio: viagem.idMunicipioSaida,
    });

    // Verificar se o município de saída foi encontrado e buscar a unidade federativa
    let nomeMunicipioSaida = "Município de saída não encontrado";
    let unidadeFederativaSaida = null;

    if (municipioSaida) {
      const ufSaida = await UnidadeFederativa.findOne({
        idUnidadeFederativa: municipioSaida.idUnidadeFederativa,
      });
      nomeMunicipioSaida = municipioSaida.NomeMunicipio;
      unidadeFederativaSaida = ufSaida
        ? {
            idUnidadeFederativa: ufSaida.idUnidadeFederativa,
            NomeUnidadeFederativa: ufSaida.NomeUnidadeFederativa,
          }
        : {
            idUnidadeFederativa: null,
            NomeUnidadeFederativa: "UF não encontrada",
          };
    }

    // 5. Buscar os destinos da viagem
    const destinos = await DestinoViagem.find({ idViagem });

    if (!destinos || destinos.length === 0) {
      throw new Error("Nenhum destino encontrado para essa viagem.");
    }

    // 6. Para cada destino, buscar o município de destino, a UF e os custos relacionados
    const destinosTratados = await Promise.all(
      destinos.map(async (destino) => {
        const municipioDestino = await Municipio.findOne({
          idMunicipio: destino.idMunicipioDestino,
        });

        // Verificar se o município de destino foi encontrado e buscar a unidade federativa
        let nomeMunicipioDestino = "Município de destino não encontrado";
        let unidadeFederativaDestino = null;

        if (municipioDestino) {
          const ufDestino = await UnidadeFederativa.findOne({
            idUnidadeFederativa: municipioDestino.idUnidadeFederativa,
          });
          nomeMunicipioDestino = municipioDestino.NomeMunicipio;
          unidadeFederativaDestino = ufDestino
            ? {
                idUnidadeFederativa: ufDestino.idUnidadeFederativa,
                NomeUnidadeFederativa: ufDestino.NomeUnidadeFederativa,
              }
            : {
                idUnidadeFederativa: null,
                NomeUnidadeFederativa: "UF não encontrada",
              };
        }

        const custos = await CustoDestino.find({
          idDestinoViagem: destino.idDestinoViagem,
        });

        // Tratar os custos e formatar o valor
        const custosTratados = await Promise.all(
          custos.map(async (custo) => {
            const tipoCusto = await TipoCusto.findOne({
              idTipoCusto: custo.idTipoCusto,
            });

            return {
              idCustoDestino: custo.idCustoDestino,
              NomeTipoCusto: tipoCusto?.NomeTipoCusto || "Desconhecido",
              ValorCustoDestino: parseFloat(custo.ValorCustoDestino),
            };
          })
        );

        // Retornar o destino tratado com o nome do município, unidade federativa e custos
        return {
          idDestinoViagem: destino.idDestinoViagem,
          municipioDestino: nomeMunicipioDestino,
          unidadeFederativaDestino: unidadeFederativaDestino,
          DataDestinoViagem: destino.DataDestinoViagem,
          custos: custosTratados,
        };
      })
    );

    // 7. Retornar a viagem com os dados do empregado, município de saída, destinos tratados e status da viagem
    return {
      idViagem: viagem.idViagem,
      empregado: nomeEmpregado,
      municipioSaida: {
        nome: nomeMunicipioSaida,
        unidadeFederativa: unidadeFederativaSaida,
      },
      DataInicioViagem: viagem.DataInicioViagem,
      DataTerminoViagem: viagem.DataTerminoViagem,
      destinos: destinosTratados,
      statusViagem: nomeStatusViagem,
    };
  } catch (error) {
    throw new Error(`Erro ao buscar viagem: ${error.message}`);
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

    const nomeEmpregado = empregado
      ? empregado.nomeEmpregado
      : "Empregado não encontrado";

    // 3. Processar cada viagem
    const viagensTratadas = await Promise.all(
      viagens.map(async (viagem) => {
        // Log de depuração
        console.log(`Processando viagem com id: ${viagem.idViagem}`);

        // Buscar o status da viagem
        const statusViagem = await StatusViagem.findOne({
          idStatusViagem: viagem.idStatusViagem,
        });

        const nomeStatusViagem = statusViagem
          ? statusViagem.NomeStatusViagem
          : "Status da viagem não encontrado";

        // Buscar o município de saída associado à viagem
        const municipioSaida = await Municipio.findOne({
          idMunicipio: viagem.idMunicipioSaida,
        });

        let nomeMunicipioSaida = "Município de saída não encontrado";
        let unidadeFederativaSaida = null;

        if (municipioSaida) {
          const ufSaida = await UnidadeFederativa.findOne({
            idUnidadeFederativa: municipioSaida.idUnidadeFederativa,
          });
          nomeMunicipioSaida = municipioSaida.NomeMunicipio;
          unidadeFederativaSaida = ufSaida
            ? {
                idUnidadeFederativa: ufSaida.idUnidadeFederativa,
                NomeUnidadeFederativa: ufSaida.NomeUnidadeFederativa,
              }
            : {
                idUnidadeFederativa: null,
                NomeUnidadeFederativa: "UF não encontrada",
              };
        }

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

            let nomeMunicipioDestino = "Município de destino não encontrado";
            let unidadeFederativaDestino = null;

            if (municipioDestino) {
              const ufDestino = await UnidadeFederativa.findOne({
                idUnidadeFederativa: municipioDestino.idUnidadeFederativa,
              });
              nomeMunicipioDestino = municipioDestino.NomeMunicipio;
              unidadeFederativaDestino = ufDestino
                ? {
                    idUnidadeFederativa: ufDestino.idUnidadeFederativa,
                    NomeUnidadeFederativa: ufDestino.NomeUnidadeFederativa,
                  }
                : {
                    idUnidadeFederativa: null,
                    NomeUnidadeFederativa: "UF não encontrada",
                  };
            }

            const custos = await CustoDestino.find({
              idDestinoViagem: destino.idDestinoViagem,
            });

            const custosTratados = await Promise.all(
              custos.map(async (custo) => {
                const tipoCusto = await TipoCusto.findOne({
                  idTipoCusto: custo.idTipoCusto,
                });

                return {
                  NomeTipoCusto: tipoCusto?.NomeTipoCusto || "Desconhecido",
                  ValorCustoDestino: parseFloat(custo.ValorCustoDestino),
                };
              })
            );

            return {
              municipioDestino: nomeMunicipioDestino,
              unidadeFederativaDestino: unidadeFederativaDestino,
              DataDestinoViagem: destino.DataDestinoViagem,
              custos: custosTratados,
            };
          })
        );

        // Retornar os dados da viagem processada
        return {
          idViagem: viagem.idViagem,
          statusViagem: nomeStatusViagem,
          municipioSaida: {
            nome: nomeMunicipioSaida,
            unidadeFederativa: unidadeFederativaSaida,
          },
          DataInicioViagem: viagem.DataInicioViagem,
          DataTerminoViagem: viagem.DataTerminoViagem,
          destinos: destinosTratados,
        };
      })
    );

    // 4. Retornar as viagens processadas com os dados do empregado
    return {
      nomeEmpregado,
      viagens: viagensTratadas,
    };
  } catch (error) {
    // Em caso de erro, retorna uma lista vazia e uma mensagem padrão
    return {
      viagens: [],
    };
  }
};

// Função para formatar valores em R$
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
    const secondaryColor = "#B3E5FC";
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
      .text(`Nome: ${viagem.empregado}`, 50, doc.y + 10)
      .text(
        `Município de Saída: ${viagem.municipioSaida.nome}, ${viagem.municipioSaida.unidadeFederativa.NomeUnidadeFederativa}`,
        50,
        doc.y + 30
      )
      .text(`Status da Viagem: ${viagem.statusViagem}`, 50, doc.y + 50)
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
          `Destino ${index + 1}: ${destino.municipioDestino}, ${
            destino.unidadeFederativaDestino.NomeUnidadeFederativa
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
            .text(`- Valor: ${formatCurrency(custo.ValorCustoDestino)}`)
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
    throw new Error(`Erro ao exportar viagem para PDF: ${error.message}`);
  }
};

// Atualizar uma viagem
export const updateViagem = async (idViagem, data) => {
  try {
    const { idEmpregado, DataInicioViagem, DataTerminoViagem, destinos } = data;

    // 1. Atualizar a viagem principal
    const viagem = await Viagem.findOneAndUpdate(
      { idViagem },
      { idEmpregado, DataInicioViagem, DataTerminoViagem },
      { new: true }
    );

    if (!viagem) {
      throw new Error("Viagem não encontrada.");
    }

    // 2. Atualizar ou adicionar novos destinos e custos
    for (const destino of destinos) {
      const { idDestinoViagem, idMunicipioDestino, DataDestinoViagem, custo } =
        destino;

      // Atualizar o destino da viagem ou criar um novo se não existir
      const destinoAtualizado = await DestinoViagem.findOneAndUpdate(
        { idDestinoViagem },
        { idMunicipioDestino, DataDestinoViagem },
        { new: true, upsert: true }
      );

      // Se o destino tiver um custo, atualizar ou criar o custo
      if (custo) {
        const { idCustoDestino, idTipoCusto, ValorCustoDestino } = custo;

        await CustoDestino.findOneAndUpdate(
          { idCustoDestino },
          {
            idDestinoViagem: destinoAtualizado.idDestinoViagem,
            idTipoCusto,
            ValorCustoDestino,
          },
          { new: true, upsert: true }
        );
      }
    }

    return viagem;
  } catch (error) {
    throw new Error(`Erro ao atualizar viagem: ${error.message}`);
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
