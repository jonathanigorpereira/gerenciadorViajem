import Cargo from "../models/Cargo.js";

// Função para criar um novo cargo
export const criarCargo = async (dadosCargo) => {
  const novoCargo = new Cargo(dadosCargo);
  await novoCargo.save();
  return novoCargo;
};
