import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";
import Cargo from "../models/Cargo.js";

const EmpregadoSchema = new mongoose.Schema(
  {
    idEmpregado: {
      type: Number,
      unique: true,
    },
    nomeEmpregado: {
      type: String,
      unique: true,
      maxlength: 80,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      maxlength: 80,
    },
    senha: {
      type: String,
      maxlength: 100, // Senha só será exigida para login "tradicional"
    },
    googleId: {
      // Para armazenar o ID único do Google
      type: String,
      unique: true, // Garantir que seja único no banco de dados
      sparse: true, // Necessário para permitir que usuários sem GoogleId também existam
    },
    idCargo: {
      type: Number,
      required: true,
    },
    ativo: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: "empregado",
    timestamps: true,
  }
);

// Faz o autoincremento de idEmpregado
EmpregadoSchema.plugin(AutoIncrement(mongoose), { inc_field: "idEmpregado" });

// Definindo o modelo Empregado corretamente
const Empregado = mongoose.model("Empregado", EmpregadoSchema);

export default Empregado;
