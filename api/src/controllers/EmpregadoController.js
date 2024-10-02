import { validarEmpregado } from "../validations/empregadoValidation.js";
import {
  criarEmpregado,
  listarEmpregadosComCargos,
  buscarEmpregadoPorId,
  atualizarEmpregado,
  excluirEmpregado,
} from "../services/empregadoService.js";

export const cadastrarEmpregado = async (req, res) => {
  try {
    // Valida os dados de entrada
    const { isValid, value, errors } = validarEmpregado(req.body);
    if (!isValid) {
      return res.status(400).json({ errors });
    }

    // Cria o empregado e salva no banco de dados
    const novoEmpregado = await criarEmpregado(value);

    // Responde com sucesso
    res.status(201).json({
      message: "Empregado cadastrado com sucesso",
      //empregado: empregadoComCargo,
    });
  } catch (error) {
    console.error("Erro ao cadastrar empregado:", error);
    res.status(500).json({
      message: "Erro ao cadastrar empregado",
      error: error.message,
    });
  }
};

// Função para listar todos os empregados com seus respectivos cargos
export const getEmpregadosComCargos = async (req, res) => {
  try {
    const empregadosComCargos = await listarEmpregadosComCargos();

    res.status(200).json(empregadosComCargos);
  } catch (error) {
    console.error("Erro ao listar empregados:", error);
    res.status(500).json({
      message: "Erro ao listar empregados",
      error: error.message,
    });
  }
};

//Função para buscar o empregado pelo id
export const getEmpregadoPorId = async (req, res) => {
  try {
    const { idEmpregado } = req.params;
    const empregado = await buscarEmpregadoPorId(idEmpregado);

    if (!empregado) {
      return res.status(404).json({ message: "Empregado não encontrado" });
    }

    return res.status(200).json(empregado);
  } catch (error) {
    console.error("Erro ao buscar empregado:", error);
    return res.status(500).json({
      message: "Erro interno do servidor",
      error: error.message,
    });
  }
};

//Controller para atualizar empregado
export const updateEmpregado = async (req, res) => {
  try {
    const { idEmpregado } = req.params;
    const dadosAtualizados = req.body;

    // Chama o service para atualizar o empregado
    const empregadoAtualizado = await atualizarEmpregado(
      idEmpregado,
      dadosAtualizados
    );

    return res.status(200).json(empregadoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar empregado:", error);
    return res.status(500).json({
      message: "Erro ao atualizar empregado",
      error: error.message,
    });
  }
};

//controller para deletar o empregado
export const deleteEmpregado = async (req, res) => {
  try {
    const { idEmpregado } = req.params;

    // Chama o service para excluir o empregado
    const resultado = await excluirEmpregado(idEmpregado);

    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro ao excluir empregado:", error);
    return res.status(500).json({
      message: "Erro ao excluir empregado",
      error: error.message,
    });
  }
};
