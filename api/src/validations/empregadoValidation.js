import Joi from "joi";

// Definindo o schema de validação para empregado
export const empregadoSchema = Joi.object({
  nomeEmpregado: Joi.string().max(80).required().messages({
    "string.base": "O nome deve ser do tipo texto.",
    "string.max": "O nome deve ter no máximo 80 caracteres.",
    "any.required": "O nome do empregado é obrigatório.",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "O e-mail deve ser do tipo texto.",
    "string.email": "O e-mail informado deve ser um e-mail válido.",
    "any.required": "O e-mail do empregado é obrigatório.",
  }),
  senha: Joi.string().max(100).messages({
    "string.base": "A senha deve ser do tipo texto.",
    "string.max": "A senha deve ter no máximo 100 caracteres.",
    "any.required": "A senha do empregado é obrigatória.",
  }),
  idCargo: Joi.number().required().messages({
    "number.base": "O campo idCargo deve ser numérico.",
    "any.required": "O idCargo é obrigatório.",
  }),
  ativo: Joi.boolean().default(true),
});

// Função para validar o empregado
export const validarEmpregado = (data) => {
  const { error, value } = empregadoSchema.validate(data, {
    abortEarly: false,
  });
  if (error) {
    return {
      isValid: false,
      errors: error.details.map((detail) => detail.message),
    };
  }
  return { isValid: true, value };
};
