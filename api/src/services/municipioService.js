import Municipio from "../models/Municipio.js";
import UnidadeFederativa from "../models/UnidadeFederativa.js";
import {
  createMunicipioValidation,
  updateMunicipioValidation,
} from "../validations/municipioValidation.js";

// Criar um novo município
export const createMunicipio = async (data) => {
  try {
    // Validação dos dados de entrada
    const { error } = createMunicipioValidation.validate(data);
    if (error) {
      throw new Error(error.details[0].message);
    }

    const { NomeMunicipio, idUnidadeFederativa } = data;

    // Verifica se o NomeMunicipio já existe
    const municipioExistente = await Municipio.findOne({ NomeMunicipio });
    if (municipioExistente) {
      throw new Error("Municipio já cadastrado.");
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
    return municipio;
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
