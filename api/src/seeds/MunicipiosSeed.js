import mongoose from "mongoose";
import axios from "axios";
import Municipio from "../models/Municipio.js";
import UnidadeFederativa from "../models/UnidadeFederativa.js";
import connectDB from "../config/db.js";
import dotenv from "dotenv";

// Configuração do ambiente
dotenv.config();

// Função para buscar municípios da API do IBGE por estado
const fetchMunicipiosPorEstado = async (siglaUF, idUnidadeFederativa) => {
  try {
    const response = await axios.get(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${siglaUF}/municipios`
    );
    const municipios = response.data;

    // Mapear os municípios para o formato do modelo
    return municipios.map((municipio) => ({
      NomeMunicipio: municipio.nome,
      idUnidadeFederativa,
      ativo: true,
    }));
  } catch (error) {
    console.error(`Erro ao buscar municípios para ${siglaUF}:`, error);
    return [];
  }
};

// Função principal para buscar todos os municípios e inserir no MongoDB
const seedMunicipios = async () => {
  try {
    // Conectar ao MongoDB
    await connectDB();

    // Buscar todas as unidades federativas do banco
    const unidadesFederativas = await UnidadeFederativa.find();

    for (const uf of unidadesFederativas) {
      console.log(`Buscando municípios para ${uf.SiglaUnidadeFederativa}...`);

      // Buscar municípios da unidade federativa pela API do IBGE
      const municipios = await fetchMunicipiosPorEstado(
        uf.SiglaUnidadeFederativa,
        uf.idUnidadeFederativa
      );

      // Verificar se os municípios já existem na coleção antes de inserir
      for (const municipio of municipios) {
        try {
          // Verificação baseada em NomeMunicipio e idUnidadeFederativa
          const municipioExistente = await Municipio.findOne({
            NomeMunicipio: municipio.NomeMunicipio,
            idUnidadeFederativa: municipio.idUnidadeFederativa,
          });

          if (!municipioExistente) {
            // Inserir município no banco se não existir para aquela Unidade Federativa
            await Municipio.create(municipio);
            console.log(
              `Município ${municipio.NomeMunicipio} em ${uf.NomeUnidadeFederativa} inserido com sucesso.`
            );
          } else {
            console.log(
              `Município ${municipio.NomeMunicipio} em ${uf.NomeUnidadeFederativa} já existe, pular inserção.`
            );
          }
        } catch (error) {
          console.error(
            `Erro ao verificar/inserir o município ${municipio.NomeMunicipio} em ${uf.NomeUnidadeFederativa}:`,
            error
          );
        }
      }
    }

    // Fechar a conexão após a operação
    mongoose.connection.close();
    console.log("Conexão com MongoDB fechada.");
  } catch (error) {
    console.error("Erro ao verificar ou inserir municípios:", error);
    mongoose.connection.close();
  }
};

// Executa a função para buscar e inserir os dados
seedMunicipios();
