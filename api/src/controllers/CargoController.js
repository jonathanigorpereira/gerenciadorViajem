import { validarCargo } from "../validations/cargoValidation.js";
import { criarCargo } from "../services/cargoService.js";

// Controlador para cadastrar um novo cargo
export const cadastrarCargo = async (req, res) => {
  try {
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
