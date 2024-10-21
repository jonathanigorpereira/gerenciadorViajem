import axios from "axios";
import Municipio from "../models/Municipio.js";
import UnidadeFederativa from "../models/UnidadeFederativa.js";
import {
  createMunicipioValidation,
  updateMunicipioValidation,
} from "../validations/municipioValidation.js";

// Função para verificar se o município pertence ao estado correto usando a API do IBGE
export const verificarMunicipioPorEstado = async (nomeMunicipio, siglaUF) => {
  try {
    // Faz a requisição para obter os municípios do estado fornecido (siglaUF)
    const response = await axios.get(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${siglaUF}/municipios`
    );
    const municipios = response.data;

    // Verifica se o município existe na lista de municípios daquele estado
    return municipios.some(
      (municipio) =>
        municipio.nome.toLowerCase() === nomeMunicipio.toLowerCase()
    );
  } catch (error) {
    throw new Error("Erro ao validar município com a API do IBGE.");
  }
};

// Criar um novo município
export const createMunicipio = async (data) => {
  try {
    // Validação dos dados de entrada
    const { error } = createMunicipioValidation.validate(data);
    if (error) {
      throw new Error(error.details[0].message);
    }

    const { NomeMunicipio, idUnidadeFederativa } = data;

    const unidadeFederativa = await UnidadeFederativa.findOne({
      idUnidadeFederativa: idUnidadeFederativa,
    });

    if (!unidadeFederativa) {
      throw new Error("Unidade Federativa não existe.");
    }

    // Verifica se o NomeMunicipio já existe
    const municipioExistente = await Municipio.findOne({ NomeMunicipio });
    if (municipioExistente) {
      throw new Error("Municipio já cadastrado.");
    }

    const municipioValido = await verificarMunicipioPorEstado(
      NomeMunicipio,
      unidadeFederativa.SiglaUnidadeFederativa
    );
    if (!municipioValido) {
      throw new Error(
        `O município ${NomeMunicipio} não pertence ao estado ${unidadeFederativa.NomeUnidadeFederativa} - ${unidadeFederativa.SiglaUnidadeFederativa}.`
      );
    }

    // Cria um novo registro de município
    const municipio = new Municipio({
      NomeMunicipio,
      idUnidadeFederativa,
    });

    // Salva no banco de dados
    return await municipio.save();
  } catch (error) {
    throw new Error(`Erro ao criar município: ${error.message}`);
  }
};

// Buscar um município por ID e trazer informações da unidade federativa
export const getMunicipioById = async (idMunicipio) => {
  try {
    // Busca o município pelo idMunicipio
    const municipio = await Municipio.findOne({ idMunicipio });
    if (!municipio) {
      throw new Error("Município não encontrado.");
    }

    // Busca a unidade federativa pelo idUnidadeFederativa do município
    const unidadeFederativa = await UnidadeFederativa.findOne({
      idUnidadeFederativa: municipio.idUnidadeFederativa,
    });

    // Adiciona os dados da unidade federativa ao objeto do município
    return {
      ...municipio.toObject(),
      unidadeFederativa,
    };
  } catch (error) {
    throw new Error(`Erro ao buscar município: ${error.message}`);
  }
};

export const getMunicipiosByUF = async (idUnidadeFederativa) => {
  try {
    // Busca todos os municípios pela unidade federativa
    const municipios = await Municipio.find({ idUnidadeFederativa });
    if (!municipios || municipios.length === 0) {
      throw new Error(
        "Nenhum município encontrado para a unidade federativa informada."
      );
    }

    // Busca a unidade federativa pelo idUnidadeFederativa
    const unidadeFederativa = await UnidadeFederativa.findOne({
      idUnidadeFederativa,
    });
    if (!unidadeFederativa) {
      throw new Error("Unidade Federativa não encontrada.");
    }

    // Adiciona os dados da unidade federativa a cada município
    return municipios.map((municipio) => {
      const { NomeMunicipio, idMunicipio, ativo } = municipio.toObject();
      const { SiglaUnidadeFederativa, NomeUnidadeFederativa } =
        unidadeFederativa;
      return {
        NomeMunicipio,
        idMunicipio,
        ativo,
      };
    });
  } catch (error) {
    throw new Error(`Erro ao buscar municípios: ${error.message}`);
  }
};

// Atualizar um município por ID
export const updateMunicipio = async (idMunicipio, data) => {
  try {
    // Validação dos dados de entrada
    const { error } = updateMunicipioValidation.validate(data);
    if (error) {
      throw new Error(error.details[0].message);
    }

    const municipio = await Municipio.findOneAndUpdate(
      { idMunicipio: idMunicipio },
      data,
      { new: true }
    );
    if (!municipio) {
      throw new Error("Município não encontrado para atualização.");
    }
    return municipio;
  } catch (error) {
    throw new Error(`Erro ao atualizar município: ${error.message}`);
  }
};

// Deletar um município por ID
export const deleteMunicipio = async (idMunicipio) => {
  try {
    const municipio = await Municipio.findOneAndDelete({ idMunicipio });
    if (!municipio) {
      throw new Error("Município não encontrado para exclusão.");
    }
    return { message: "Município excluído com sucesso" };
  } catch (error) {
    throw new Error(`Erro ao excluir município: ${error.message}`);
  }
};

// Buscar todos os municípios e trazer informações da unidade federativa
export const getAllMunicipios = async (filter = {}) => {
  try {
    const municipios = await Municipio.find(filter);

    // Para cada município, busca e anexa as informações da unidade federativa
    const municipiosComUnidadeFederativa = await Promise.all(
      municipios.map(async (municipio) => {
        const unidadeFederativa = await UnidadeFederativa.findOne({
          idUnidadeFederativa: municipio.idUnidadeFederativa,
        });
        return {
          ...municipio.toObject(),
          unidadeFederativa,
        };
      })
    );

    return municipiosComUnidadeFederativa;
  } catch (error) {
    throw new Error(`Erro ao buscar municípios: ${error.message}`);
  }
};
