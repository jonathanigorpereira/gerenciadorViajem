import StatusViagem from "../models/StatusViagem.js";
import connectDB from "../config/db.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
// Configuração do ambiente
dotenv.config();

// Dados dos Status de Viagem
const statusViagemData = [
  { idStatusViagem: 1, NomeStatusViagem: "Pendente", ativo: true },
  { idStatusViagem: 2, NomeStatusViagem: "Aprovado", ativo: true },
  { idStatusViagem: 3, NomeStatusViagem: "Reprovado", ativo: true },
];

// Função para verificar e inserir os Status de Viagem, se a coleção estiver vazia
const seedStatusViagem = async () => {
  try {
    // Conectar ao MongoDB
    await connectDB();

    // Verifica se já existem registros na coleção
    const count = await StatusViagem.countDocuments();

    if (count === 0) {
      // Se a coleção estiver vazia, insira os dados
      console.log("Nenhum Status de Viagem encontrado. Inserindo dados...");
      await StatusViagem.insertMany(statusViagemData);
      console.log("Status de Viagem inseridos com sucesso!");
    } else {
      console.log(
        `Já existem ${count} Status de Viagem na coleção. Nenhuma inserção necessária.`
      );
    }

    // Fechar a conexão após a operação
    mongoose.connection.close();
    console.log("Conexão com MongoDB fechada.");
  } catch (error) {
    console.error("Erro ao verificar ou inserir Status de Viagem:", error);
    mongoose.connection.close(); // Fechar a conexão em caso de erro também
  }
};

// Executa a função para verificar e inserir os dados
seedStatusViagem();
