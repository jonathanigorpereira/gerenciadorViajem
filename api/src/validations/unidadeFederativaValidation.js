import Joi from "joi";

// Schema de validação para criação e atualização
export const unidadeFederativaSchema = Joi.object({
  SiglaUnidadeFederativa: Joi.string().max(45).required().messages({
    "string.base": "A Sigla da Unidade Federativa deve ser um texto.",
    "string.max":
      "A Sigla da Unidade Federativa não pode ter mais que 45 caracteres.",
    "any.required": "A Sigla da Unidade Federativa é obrigatória.",
  }),

  NomeUnidadeFederativa: Joi.string().max(45).required().messages({
    "string.base": "O Nome da Unidade Federativa deve ser um texto.",
    "string.max":
      "O Nome da Unidade Federativa não pode ter mais que 45 caracteres.",
    "any.required": "O Nome da Unidade Federativa é obrigatório.",
  }),

  ativo: Joi.boolean().default(true).messages({
    "boolean.base": "O campo ativo deve ser um valor booleano (true ou false).",
  }),
});

// Validação para deletar (apenas verifica o idUnidadeFederativa)
export const unidadeFederativaIdSchema = Joi.object({
  idUnidadeFederativa: Joi.number().integer().positive().required().messages({
    "number.base": "O ID da Unidade Federativa deve ser um número inteiro.",
    "number.integer": "O ID da Unidade Federativa deve ser um número inteiro.",
    "number.positive": "O ID da Unidade Federativa deve ser positivo.",
    "any.required":
      "O ID da Unidade Federativa é obrigatório para essa operação.",
  }),
});
