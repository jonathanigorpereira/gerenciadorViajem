import {
  createViagem,
  getViagemById,
  getViagensByEmpregadoId,
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

export const buscarViagemPeloEmpregadoId = async (req, res) => {
  try {
    const viagem = await getViagemById(req.params.idEmpregado);
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
    await exportViagemToPdf(idViagem, res); // Passa a resposta para o serviço
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
