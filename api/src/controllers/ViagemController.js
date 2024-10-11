import {
  createViagem,
  getViagemById,
  updateViagem,
  deleteViagem,
  exportViagemToPdf,
} from "../services/viagemService.js";
import path from "path";
import os from "os";

// Criar uma nova viagem
export const criarViagem = async (req, res) => {
  try {
    const novaViagem = await createViagem(req.body);
    return res.status(201).json(novaViagem);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Buscar uma viagem por ID
export const buscarViagemPeloId = async (req, res) => {
  try {
    const viagem = await getViagemById(req.params.idViagem);
    return res.status(200).json(viagem);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Atualizar uma viagem
export const atualizarViagem = async (req, res) => {
  try {
    const viagemAtualizada = await updateViagem(req.params.idViagem, req.body);
    return res.status(200).json(viagemAtualizada);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Excluir uma viagem por ID
export const deletarViagem = async (req, res) => {
  try {
    const viagemExcluida = await deleteViagem(req.params.idViagem);
    return res.status(200).json(viagemExcluida);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Exportar viagem e destinos em PDF e baixar na pasta de Downloads do usuário
export const exportarViagemToPdf = async (req, res) => {
  try {
    const { idViagem } = req.params;

    // Definir o nome do arquivo PDF
    const fileName = `viagem_${idViagem}.pdf`;

    // Diretório de downloads padrão (usando o diretório de downloads do usuário)
    const userHomeDir = os.homedir(); // Usando 'os' para obter o diretório de casa do usuário
    const outputPath = path.join(userHomeDir, "Downloads", fileName);

    // Gerar o PDF
    await exportViagemToPdf(idViagem, outputPath);

    // Enviar o arquivo para download
    res.download(outputPath, fileName, (err) => {
      if (err) {
        res.status(500).json({ message: "Erro ao baixar o arquivo." });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
