import {
  unidadeFederativaSchema,
  unidadeFederativaIdSchema,
} from "../validations/unidadeFederativaValidation.js";

import {
  createUnidadeFederativa,
  getUnidadeFederativaById,
  getAllUnidadesFederativas,
  updateUnidadeFederativa,
  deleteUnidadeFederativa,
} from "../services/unidadeFederativaService.js";

// Controller para criar uma nova Unidade Federativa
export const cadastrarUnidadeFederativa = async (req, res) => {
  try {
    // Valida os dados de entrada com Joi
    const { error } = unidadeFederativaSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const unidadeFederativa = await createUnidadeFederativa(req.body);
    return res.status(201).json(unidadeFederativa);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Controller para buscar uma Unidade Federativa por ID
export const obterUnidadeFederativaPorId = async (req, res) => {
  try {
    // Valida o ID da Unidade Federativa com Joi
    const { error } = unidadeFederativaIdSchema.validate({
      idUnidadeFederativa: req.params.idUnidadeFederativa,
    });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const unidadeFederativa = await getUnidadeFederativaById(
      req.params.idUnidadeFederativa
    );
    if (!unidadeFederativa) {
      return res
        .status(404)
        .json({ error: "Unidade Federativa não encontrada" });
    }
    return res.status(200).json(unidadeFederativa);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Controller para buscar todas as Unidades Federativas
export const listarTodasUnidadesFederativas = async (req, res) => {
  try {
    const unidadesFederativas = await getAllUnidadesFederativas();
    return res.status(200).json(unidadesFederativas);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Controller para atualizar uma Unidade Federativa
export const atualizarUnidadeFederativaExistente = async (req, res) => {
  try {
    // Captura e converte o idUnidadeFederativa para número
    const idUnidadeFederativa = Number(req.params.idUnidadeFederativa);

    // Verifica se o ID é um número válido (não NaN e positivo)
    if (isNaN(idUnidadeFederativa) || idUnidadeFederativa <= 0) {
      return res
        .status(400)
        .json({ error: "ID da Unidade Federativa inválido" });
    }

    // Valida o ID da Unidade Federativa com Joi
    const { error: idError } = unidadeFederativaIdSchema.validate({
      idUnidadeFederativa: idUnidadeFederativa,
    });

    if (idError) {
      return res.status(400).json({ error: idError.details[0].message });
    }

    // Valida os dados de entrada com Joi
    const { error } = unidadeFederativaSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Chama a função de atualização no serviço
    const unidadeFederativa = await updateUnidadeFederativa(
      idUnidadeFederativa,
      req.body
    );

    if (!unidadeFederativa) {
      return res
        .status(404)
        .json({ error: "Unidade Federativa não encontrada para atualização" });
    }

    // Retorna a unidade federativa atualizada
    return res.status(200).json(unidadeFederativa);
  } catch (error) {
    // Retorna erros inesperados
    return res.status(400).json({ error: error.message });
  }
};

// Controller para deletar uma Unidade Federativa
export const deletarUnidadeFederativa = async (req, res) => {
  try {
    // Valida o ID da Unidade Federativa com Joi
    const { error } = unidadeFederativaIdSchema.validate({
      idUnidadeFederativa: req.params.id,
    });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const unidadeFederativa = await deleteUnidadeFederativa(req.params.id);
    if (!unidadeFederativa) {
      return res
        .status(404)
        .json({ error: "Unidade Federativa não encontrada para exclusão" });
    }
    return res.status(204).json();
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
