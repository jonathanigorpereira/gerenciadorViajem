import {
  createMunicipio,
  getMunicipioById,
  updateMunicipio,
  deleteMunicipio,
  getAllMunicipios,
  getMunicipiosByUF,
} from "../services/municipioService.js";

// Função para buscar todos os municípios
export const buscarTodosMunicipios = async (req, res) => {
  try {
    const municipios = await getAllMunicipios();
    return res.status(200).json(municipios);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Função para buscar um município por ID
export const buscarMunicipioPeloId = async (req, res) => {
  try {
    const { idMunicipio } = req.params;
    const municipio = await getMunicipioById(idMunicipio);
    return res.status(200).json(municipio);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const buscarMunicipioPeloIdUnidadeFederativa = async (req, res) => {
  try {
    const { idUnidadeFederativa } = req.params;
    const municipios = await getMunicipiosByUF(idUnidadeFederativa);
    return res.status(200).json(municipios);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Função para criar um novo município
export const cirarMunicipio = async (req, res) => {
  try {
    const data = req.body;
    const municipio = await createMunicipio(data);
    return res.status(201).json(municipio);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Função para atualizar um município por ID
export const atualizarMunicipio = async (req, res) => {
  try {
    const { idMunicipio } = req.params;
    const data = req.body;
    const municipio = await updateMunicipio(idMunicipio, data);
    return res.status(200).json(municipio);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Função para deletar um município por ID
export const deletarMunicipio = async (req, res) => {
  try {
    const { idMunicipio } = req.params;
    const municipio = await deleteMunicipio(idMunicipio);
    return res.status(200).json(municipio);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
