import Joi from "joi";

// Definindo o schema de validação para o cargo
export const cargoSchema = Joi.object({
  nomeCargo: Joi.string().max(45).required().messages({
    "string.base": "O nome do cargo deve ser do tipo texto.",
    "string.max": "O nome do cargo deve ter no máximo 45 caracteres.",
    "any.required": "O nome do cargo é obrigatório.",
  }),
  ativo: Joi.boolean().default(true),
});

// Função para validar o cargo
export const validarCargo = (data) => {
  const { error, value } = cargoSchema.validate(data, { abortEarly: false });
  if (error) {
    return {
      isValid: false,
      errors: error.details.map((detail) => detail.message),
    };
  }
  return { isValid: true, value };
};
