import {
  createViagem,
  getViagemById,
  getViagensByEmpregadoId,
  updateViagem,
  approveViagem,
  disapproveViagem,
  deleteViagem,
  exportViagemToPdf,
} from "../services/viagemService.js";
import Empregado from "../models/Empregado.js";
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
    const viagem = await getViagensByEmpregadoId(req.params.idEmpregado);
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
    await exportViagemToPdf(idViagem, res);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Função para aprovar uma viagem
export const aprovarViagem = async (req, res) => {
  try {
    const { idViagem } = req.params;
    // 1. Buscar o empregado aprovador
    const empregadoAprovador = await Empregado.findOne({
      idEmpregado: req.user.idEmpregado,
    });

    if (!empregadoAprovador) {
      return res.status(404).json({ error: "Empregado não encontrado." });
    }

    // 2. Verificar se o empregado tem idCargo = 1
    if (empregadoAprovador.idCargo !== 1) {
      return res.status(403).json({
        error: "Apenas administradores podem aprovar viagens.",
      });
    }

    // 3. Chamar a função de serviço para aprovar a viagem
    await approveViagem(idViagem);

    // 4. Retornar a mensagem de sucesso
    return res.status(200).json({ message: "Viagem aprovada com sucesso!" });
  } catch (error) {
    // Tratamento de erros
    return res.status(500).json({ error: error.message });
  }
};

// Função para reprovar uma viagem
export const reprovarViagem = async (req, res) => {
  try {
    const { idViagem } = req.params;
    // 1. Buscar o empregado aprovador
    const empregadoAprovador = await Empregado.findOne({
      idEmpregado: req.user.idEmpregado,
    });

    if (!empregadoAprovador) {
      return res.status(404).json({ error: "Empregado não encontrado." });
    }

    // 2. Verificar se o empregado tem idCargo = 1
    if (empregadoAprovador.idCargo !== 1) {
      return res.status(403).json({
        error: "Apenas administradores podem reprovar viagens.",
      });
    }

    // 3. Chamar a função de serviço para aprovar a viagem
    await disapproveViagem(idViagem);

    // 4. Retornar a mensagem de sucesso
    return res.status(200).json({ message: "Viagem reprovada com sucesso!" });
  } catch (error) {
    // Tratamento de erros
    return res.status(500).json({ error: error.message });
  }
};
