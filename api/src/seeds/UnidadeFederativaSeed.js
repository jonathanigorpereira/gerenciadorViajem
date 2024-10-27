import mongoose from "mongoose";
import UnidadeFederativa from "../models/UnidadeFederativa.js";
import connectDB from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

const unidadeFederativaData = [
  { SiglaUnidadeFederativa: "AC", NomeUnidadeFederativa: "Acre" },
  { SiglaUnidadeFederativa: "AL", NomeUnidadeFederativa: "Alagoas" },
  { SiglaUnidadeFederativa: "AP", NomeUnidadeFederativa: "Amapá" },
  { SiglaUnidadeFederativa: "AM", NomeUnidadeFederativa: "Amazonas" },
  { SiglaUnidadeFederativa: "BA", NomeUnidadeFederativa: "Bahia" },
  { SiglaUnidadeFederativa: "CE", NomeUnidadeFederativa: "Ceará" },
  { SiglaUnidadeFederativa: "DF", NomeUnidadeFederativa: "Distrito Federal" },
  { SiglaUnidadeFederativa: "ES", NomeUnidadeFederativa: "Espírito Santo" },
  { SiglaUnidadeFederativa: "GO", NomeUnidadeFederativa: "Goiás" },
  { SiglaUnidadeFederativa: "MA", NomeUnidadeFederativa: "Maranhão" },
  { SiglaUnidadeFederativa: "MT", NomeUnidadeFederativa: "Mato Grosso" },
  { SiglaUnidadeFederativa: "MS", NomeUnidadeFederativa: "Mato Grosso do Sul" },
  { SiglaUnidadeFederativa: "MG", NomeUnidadeFederativa: "Minas Gerais" },
  { SiglaUnidadeFederativa: "PA", NomeUnidadeFederativa: "Pará" },
  { SiglaUnidadeFederativa: "PB", NomeUnidadeFederativa: "Paraíba" },
  { SiglaUnidadeFederativa: "PR", NomeUnidadeFederativa: "Paraná" },
  { SiglaUnidadeFederativa: "PE", NomeUnidadeFederativa: "Pernambuco" },
  { SiglaUnidadeFederativa: "PI", NomeUnidadeFederativa: "Piauí" },
  { SiglaUnidadeFederativa: "RJ", NomeUnidadeFederativa: "Rio de Janeiro" },
  {
    SiglaUnidadeFederativa: "RN",
    NomeUnidadeFederativa: "Rio Grande do Norte",
  },
  { SiglaUnidadeFederativa: "RS", NomeUnidadeFederativa: "Rio Grande do Sul" },
  { SiglaUnidadeFederativa: "RO", NomeUnidadeFederativa: "Rondônia" },
  { SiglaUnidadeFederativa: "RR", NomeUnidadeFederativa: "Roraima" },
  { SiglaUnidadeFederativa: "SC", NomeUnidadeFederativa: "Santa Catarina" },
  { SiglaUnidadeFederativa: "SP", NomeUnidadeFederativa: "São Paulo" },
  { SiglaUnidadeFederativa: "SE", NomeUnidadeFederativa: "Sergipe" },
  { SiglaUnidadeFederativa: "TO", NomeUnidadeFederativa: "Tocantins" },
];

const seedUnidadeFederativa = async () => {
  try {
    // Conectar ao MongoDB
    await connectDB();

    await UnidadeFederativa.deleteMany({});
    console.log("Coleção 'unidadeFederativa' limpa.");

    await UnidadeFederativa.insertMany(unidadeFederativaData);
    console.log("Dados de 'Unidade Federativa' inseridos com sucesso!");

    await mongoose.connection.close();
    console.log("Conexão com MongoDB fechada.");
  } catch (error) {
    console.error("Erro ao inserir os dados de 'Unidade Federativa':", error);
    mongoose.connection.close();
  }
};

seedUnidadeFederativa();
