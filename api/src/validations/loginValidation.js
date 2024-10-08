import Joi from "joi";

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .max(80)
      .messages({
        "string.email": "O e-mail precisa ser válido.",
        "string.empty": "O campo de e-mail é obrigatório.",
        "string.max": "O e-mail não pode exceder 80 caracteres.",
      }),
    senha: Joi.string()
      .min(8)
      .max(100)
      .required()
      .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*()_+=-]{8,100}$"))
      .messages({
        "string.pattern.base":
          "A senha deve ter entre 8 e 100 caracteres e pode incluir letras, números e caracteres especiais.",
        "string.empty": "O campo de senha é obrigatório.",
        "string.min": "A senha deve ter no mínimo 8 caracteres.",
        "string.max": "A senha não pode exceder 100 caracteres.",
      }),
  });

  return schema.validate(data, { abortEarly: false });
};

export default loginValidation;
