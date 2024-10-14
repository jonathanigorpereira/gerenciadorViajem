import mongoose from "mongoose";
import TipoCusto from "../models/TipoCusto.js";
import connectDB from "../config/db.js";
import dotenv from "dotenv";

// Configuração do ambiente
dotenv.config();

// Dados dos Tipos de Custo
const tipoCustoData = [
  { idTipoCusto: 1, NomeTipoCusto: "Passagens", ativo: true },
  { idTipoCusto: 2, NomeTipoCusto: "Alimentação", ativo: true },
  { idTipoCusto: 3, NomeTipoCusto: "Hospedagem", ativo: true },
  { idTipoCusto: 4, NomeTipoCusto: "Transporte (Uber ou Táxi)", ativo: true },
];

// Função para verificar e inserir os Tipos de Custo, se a coleção estiver vazia
const seedTipoCusto = async () => {
  try {
    // Conectar ao MongoDB
    await connectDB();

    // Verifica se já existem registros na coleção
    const count = await TipoCusto.countDocuments();

    if (count === 0) {
      // Se a coleção estiver vazia, insira os dados
      console.log("Nenhum Tipo de Custo encontrado. Inserindo dados...");
      await TipoCusto.insertMany(tipoCustoData);
      console.log("Tipos de Custo inseridos com sucesso!");
    } else {
      console.log(
        `Já existem ${count} Tipos de Custo na coleção. Nenhuma inserção necessária.`
      );
    }

    // Fechar a conexão após a operação
    mongoose.connection.close();
    console.log("Conexão com MongoDB fechada.");
  } catch (error) {
    console.error("Erro ao verificar ou inserir Tipos de Custo:", error);
    mongoose.connection.close();
  }
};

// Executa a função para verificar e inserir os dados
seedTipoCusto();
