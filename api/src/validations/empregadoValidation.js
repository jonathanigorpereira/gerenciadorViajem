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
  senha: Joi.string()
    .min(8)
    .max(100)
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,100}$"
      )
    )
    .messages({
      "string.pattern.base":
        "A senha deve ter entre 8 e 100 caracteres, incluir pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.",
      "string.empty": "O campo de senha é obrigatório.",
      "string.min": "A senha deve ter no mínimo 8 caracteres.",
      "string.max": "A senha não pode exceder 100 caracteres.",
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
