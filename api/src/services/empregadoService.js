import Empregado from "../models/Empregado.js";
import Cargo from "../models/Cargo.js";
import { hashPassword } from "../utils/PasswordEncrypt.js";

// Função para verificar se o cargo existe
export const verificarCargo = async (idCargo) => {
  const cargo = await Cargo.findOne({ idCargo: idCargo });
  if (!cargo) {
    throw new Error("Cargo não encontrado");
  }
  return cargo;
};

// Função para criar um novo empregado
export const criarEmpregado = async (dadosEmpregado) => {
  const novoEmpregado = new Empregado(dadosEmpregado);
  novoEmpregado.senha = await hashPassword(dadosEmpregado.senha);

  await novoEmpregado.save();
  return novoEmpregado;
};

// Função para adicionar o nome do cargo ao objeto de empregado
export const adicionarCargoAoEmpregado = async (empregado) => {
  const cargo = await verificarCargo(empregado.idCargo);

  const empregadoObj = empregado.toObject();

  return {
    nomeEmpregado: empregadoObj.nomeEmpregado,
    ativo: empregadoObj.ativo,
    cargo: cargo.nomeCargo,
  };
};

// Função para trazer todos os empregados com seus respectivos cargos
export const listarEmpregadosComCargos = async () => {
  try {
    const empregados = await Empregado.find();

    const empregadosComCargos = await Promise.all(
      empregados.map(async (empregado) => {
        const cargo = await Cargo.findOne({
          idCargo: empregado.idCargo,
          ativo: true,
        });

        return {
          idEmpregado: empregado.idEmpregado,
          nomeEmpregado: empregado.nomeEmpregado,
          email: empregado.email,
          ativo: empregado.ativo,
          cargo: {
            idCargo: cargo ? cargo.idCargo : null,
            nomeCargo: cargo ? cargo.nomeCargo : "Cargo não encontrado",
          },
          createdAt: empregado.createdAt,
          updatedAt: empregado.updatedAt,
        };
      })
    );

    return empregadosComCargos;
  } catch (error) {
    console.error("Erro ao listar empregados:", error);
    throw new Error("Não foi possível listar os empregados.");
  }
};

// Função para buscar um empregado pelo idEmpregado
export const buscarEmpregadoPorId = async (idEmpregado) => {
  try {
    // Busca o empregado pelo idEmpregado
    const empregado = await Empregado.findOne({ idEmpregado: idEmpregado });

    if (!empregado) {
      throw new Error("Empregado não encontrado");
    }

    // Busca o cargo associado ao idCargo do empregado
    const cargo = await Cargo.findOne({ idCargo: empregado.idCargo });

    // Retorna o empregado com os detalhes do cargo
    return {
      idEmpregado: empregado.idEmpregado,
      nomeEmpregado: empregado.nomeEmpregado,
      email: empregado.email,
      ativo: empregado.ativo,
      cargo: {
        idCargo: cargo ? cargo.idCargo : null,
        nomeCargo: cargo ? cargo.nomeCargo : "Cargo não encontrado",
      },
      createdAt: empregado.createdAt,
      updatedAt: empregado.updatedAt,
    };
  } catch (error) {
    console.error("Erro ao buscar empregado pelo id:", error);
    throw new Error("Não foi possível buscar o empregado.");
  }
};

//Função para atualizar um empregado
export const atualizarEmpregado = async (idEmpregado, dadosAtualizados) => {
  try {
    // Busca o empregado pelo idEmpregado
    const empregado = await Empregado.findOne({ idEmpregado: idEmpregado });

    if (!empregado) {
      throw new Error("Empregado não encontrado");
    }

    // Atualiza os campos do empregado
    Object.assign(empregado, dadosAtualizados);

    // Salva as mudanças no banco de dados
    await empregado.save();

    // Busca o cargo associado ao idCargo do empregado
    const cargo = await Cargo.findOne({ idCargo: empregado.idCargo });

    // Retorna o empregado com os detalhes do cargo
    return {
      idEmpregado: empregado.idEmpregado,
      nomeEmpregado: empregado.nomeEmpregado,
      email: empregado.email,
      ativo: empregado.ativo,
      cargo: {
        idCargo: cargo ? cargo.idCargo : null,
        nomeCargo: cargo ? cargo.nomeCargo : "Cargo não encontrado",
      },
      createdAt: empregado.createdAt,
      updatedAt: empregado.updatedAt,
    };
  } catch (error) {
    console.error("Erro ao atualizar o empregado:", error);
    throw new Error("Não foi possível atualizar o empregado.");
  }
};

// Função para excluir um empregado
export const excluirEmpregado = async (idEmpregado) => {
  try {
    const empregado = await Empregado.findOne({ idEmpregado: idEmpregado });

    if (!empregado) {
      throw new Error("Empregado não encontrado");
    }

    await Empregado.deleteOne({ idEmpregado: idEmpregado });

    return { message: "Empregado excluído com sucesso" };
  } catch (error) {
    console.error("Erro ao excluir o empregado:", error);
    throw new Error("Não foi possível excluir o empregado.");
  }
};
