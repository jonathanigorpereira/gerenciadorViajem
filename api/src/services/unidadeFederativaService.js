import UnidadeFederativa from "../models/UnidadeFederativa.js";

// Função utilitária para tratamento de erros
const handleError = (operation, error) => {
  throw new Error(`Erro ao ${operation} Unidade Federativa: ${error.message}`);
};

// Criar nova Unidade Federativa com validação de duplicidade
export const createUnidadeFederativa = async (data) => {
  try {
    const existingUnidade = await UnidadeFederativa.findOne({
      $or: [
        { SiglaUnidadeFederativa: data.SiglaUnidadeFederativa },
        { NomeUnidadeFederativa: data.NomeUnidadeFederativa },
      ],
    });

    if (existingUnidade) {
      throw new Error(
        "Já existe uma Unidade Federativa com essa sigla ou nome."
      );
    }

    const unidadeFederativa = new UnidadeFederativa(data);
    return await unidadeFederativa.save();
  } catch (error) {
    handleError("criar", error);
  }
};

// Buscar Unidade Federativa por ID
export const getUnidadeFederativaById = async (idUnidadeFederativa) => {
  try {
    const unidadeFederativa = await UnidadeFederativa.findOne({
      idUnidadeFederativa,
    }).lean();
    if (!unidadeFederativa) {
      throw new Error("Unidade Federativa não encontrada");
    }
    return unidadeFederativa;
  } catch (error) {
    handleError("buscar", error);
  }
};

// Buscar todas as Unidades Federativas
export const getAllUnidadesFederativas = async () => {
  try {
    return await UnidadeFederativa.find().lean();
  } catch (error) {
    handleError("buscar todas as", error);
  }
};

// Atualizar Unidade Federativa com validação de existência e duplicidade
export const updateUnidadeFederativa = async (idUnidadeFederativa, data) => {
  try {
    // Verifica se a unidade federativa existe
    const unidadeExistente = await UnidadeFederativa.findOne({
      idUnidadeFederativa: idUnidadeFederativa,
    });
    if (!unidadeExistente) {
      throw new Error("Unidade Federativa não encontrada para atualização.");
    }

    // Verifica se já existe outra unidade federativa com a mesma sigla ou nome
    const existingUnidade = await UnidadeFederativa.findOne({
      $or: [
        { SiglaUnidadeFederativa: data.SiglaUnidadeFederativa },
        { NomeUnidadeFederativa: data.NomeUnidadeFederativa },
      ],
      idUnidadeFederativa: { $ne: idUnidadeFederativa },
    });

    if (existingUnidade) {
      throw new Error(
        "Já existe uma Unidade Federativa com essa sigla ou nome."
      );
    }

    // Atualiza a unidade federativa com base no campo idUnidadeFederativa
    const unidadeFederativa = await UnidadeFederativa.findOneAndUpdate(
      { idUnidadeFederativa: idUnidadeFederativa },
      data,
      { new: true }
    );

    if (!unidadeFederativa) {
      throw new Error("Erro ao atualizar a Unidade Federativa.");
    }

    return unidadeFederativa;
  } catch (error) {
    handleError("atualizar", error);
  }
};

// Deletar Unidade Federativa com validação de existência
export const deleteUnidadeFederativa = async (id) => {
  try {
    const unidadeExistente = await UnidadeFederativa.findById(id);
    if (!unidadeExistente) {
      throw new Error("Unidade Federativa não encontrada para exclusão.");
    }

    const unidadeFederativa = await UnidadeFederativa.findByIdAndDelete(id);
    return { message: "Unidade Federativa excluída com sucesso" };
  } catch (error) {
    handleError("deletar", error);
  }
};
