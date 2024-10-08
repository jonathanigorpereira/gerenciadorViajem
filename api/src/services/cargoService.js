import Cargo from "../models/Cargo.js";

// Função para criar um novo cargo (Create)
export const criarCargo = async (dadosCargo) => {
  try {
    const novoCargo = new Cargo(dadosCargo);
    await novoCargo.save();
    return novoCargo;
  } catch (error) {
    throw new Error("Erro ao criar o cargo: " + error.message);
  }
};

// Função para listar todos os cargos (Read)
export const listarCargos = async () => {
  try {
    const cargos = await Cargo.find();
    return cargos;
  } catch (error) {
    throw new Error("Erro ao listar os cargos: " + error.message);
  }
};

// Função para buscar um cargo por ID (Read by ID)
export const buscarCargoPorId = async (idCargo) => {
  try {
    const cargo = await Cargo.findById(idCargo);
    if (!cargo) {
      throw new Error("Cargo não encontrado");
    }
    return cargo;
  } catch (error) {
    throw new Error("Erro ao buscar o cargo: " + error.message);
  }
};

// Função para atualizar um cargo (Update)
export const atualizarCargo = async (idCargo, dadosAtualizados) => {
  try {
    const cargoAtualizado = await Cargo.findByIdAndUpdate(
      idCargo,
      dadosAtualizados,
      {
        new: true, // Retorna o documento atualizado
        runValidators: true, // Aplica as validações definidas no modelo
      }
    );

    if (!cargoAtualizado) {
      throw new Error("Cargo não encontrado para atualização");
    }
    return cargoAtualizado;
  } catch (error) {
    throw new Error("Erro ao atualizar o cargo: " + error.message);
  }
};

// Função para excluir um cargo (Delete)
export const excluirCargo = async (idCargo) => {
  try {
    const cargoExcluido = await Cargo.findByIdAndDelete(idCargo);

    if (!cargoExcluido) {
      throw new Error("Cargo não encontrado para exclusão");
    }
    return { message: "Cargo excluído com sucesso" };
  } catch (error) {
    throw new Error("Erro ao excluir o cargo: " + error.message);
  }
};
