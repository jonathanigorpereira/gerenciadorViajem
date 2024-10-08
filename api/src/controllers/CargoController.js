import { validarCargo } from "../validations/cargoValidation.js";
import {
  criarCargo,
  listarCargos,
  buscarCargoPorId,
  atualizarCargo,
  excluirCargo,
} from "../services/cargoService.js";

// Controlador para cadastrar um novo cargo (Create)
export const cadastrarCargo = async (req, res) => {
  try {
    // Verifica se o usuário logado tem o cargo correto para realizar a ação
    if (req.user.idCargo !== 1) {
      return res
        .status(403)
        .json({
          message:
            "Acesso negado. Apenas administradores podem realizar esta ação.",
        });
    }

    // Validação dos dados de entrada
    const { isValid, value, errors } = validarCargo(req.body);
    if (!isValid) {
      return res.status(400).json({ errors });
    }

    // Cria o cargo e salva no banco de dados
    const novoCargo = await criarCargo(value);

    // Responde com sucesso
    res.status(201).json({
      message: "Cargo cadastrado com sucesso",
      cargo: novoCargo,
    });
  } catch (error) {
    console.error("Erro ao cadastrar cargo:", error);
    res.status(500).json({
      message: "Erro ao cadastrar cargo",
      error: error.message,
    });
  }
};

// Controlador para listar todos os cargos (Read)
export const listarTodosCargos = async (req, res) => {
  try {
    // Aqui qualquer usuário autenticado pode listar os cargos
    const cargos = await listarCargos();
    res.status(200).json(cargos);
  } catch (error) {
    console.error("Erro ao listar cargos:", error);
    res.status(500).json({
      message: "Erro ao listar cargos",
      error: error.message,
    });
  }
};

// Controlador para buscar um cargo por ID (Read by ID)
export const obterCargoPorId = async (req, res) => {
  try {
    const cargo = await buscarCargoPorId(req.params.idCargo);
    res.status(200).json(cargo);
  } catch (error) {
    console.error("Erro ao buscar cargo:", error);
    res.status(404).json({
      message: "Cargo não encontrado",
      error: error.message,
    });
  }
};

// Controlador para atualizar um cargo (Update)
export const atualizarCargoExistente = async (req, res) => {
  try {
    // Verifica se o usuário logado tem permissão (idCargo = 1)
    if (req.user.idCargo !== 1) {
      return res
        .status(403)
        .json({
          message:
            "Acesso negado. Apenas administradores podem realizar esta ação.",
        });
    }

    // Validação dos dados de entrada (opcional, caso queira validar)
    const { isValid, value, errors } = validarCargo(req.body);
    if (!isValid) {
      return res.status(400).json({ errors });
    }

    const cargoAtualizado = await atualizarCargo(req.params.idCargo, value);
    res.status(200).json({
      message: "Cargo atualizado com sucesso",
      cargo: cargoAtualizado,
    });
  } catch (error) {
    console.error("Erro ao atualizar cargo:", error);
    res.status(400).json({
      message: "Erro ao atualizar cargo",
      error: error.message,
    });
  }
};

// Controlador para excluir um cargo (Delete)
export const deletarCargo = async (req, res) => {
  try {
    // Verifica se o usuário logado tem permissão (idCargo = 1)
    if (req.user.idCargo !== 1) {
      return res
        .status(403)
        .json({
          message:
            "Acesso negado. Apenas administradores podem realizar esta ação.",
        });
    }

    await excluirCargo(req.params.idCargo);
    res.status(200).json({
      message: "Cargo excluído com sucesso",
    });
  } catch (error) {
    console.error("Erro ao excluir cargo:", error);
    res.status(404).json({
      message: "Cargo não encontrado para exclusão",
      error: error.message,
    });
  }
};
