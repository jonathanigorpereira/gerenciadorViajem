import Joi from "joi";

// Esquema de validação para criação de município
export const createMunicipioValidation = Joi.object({
  NomeMunicipio: Joi.string().max(45).required().messages({
    "string.base": "Nome do município deve ser uma string.",
    "string.empty": "Nome do município não pode estar vazio.",
    "string.max": "Nome do município não pode exceder 45 caracteres.",
    "any.required": "Nome do município é obrigatório.",
  }),

  idUnidadeFederativa: Joi.number().integer().required().messages({
    "number.base": "ID da Unidade Federativa deve ser um número.",
    "any.required": "ID da Unidade Federativa é obrigatório.",
  }),

  ativo: Joi.boolean().optional().default(true).messages({
    "boolean.base": "Ativo deve ser um valor booleano.",
  }),
});

// Esquema de validação para atualização de município
export const updateMunicipioValidation = Joi.object({
  NomeMunicipio: Joi.string().max(45).optional().messages({
    "string.base": "Nome do município deve ser uma string.",
    "string.max": "Nome do município não pode exceder 45 caracteres.",
  }),

  idUnidadeFederativa: Joi.number().integer().optional().messages({
    "number.base": "ID da Unidade Federativa deve ser um número.",
  }),

  ativo: Joi.boolean().optional().messages({
    "boolean.base": "Ativo deve ser um valor booleano.",
  }),
});
