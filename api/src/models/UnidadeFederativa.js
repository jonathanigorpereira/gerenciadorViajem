import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";

const UnidadeFerativaSchema = mongoose.Schema(
  {
    idUnidadeFederativa: {
      type: Number,
      unique: true,
    },
    SiglaUnidadeFederativa: {
      type: String,
      unique: true,
      required: true,
      maxlength: 45,
    },
    NomeUnidadeFederativa: {
      type: String,
      unique: true,
      required: true,
      maxlength: 45,
    },
    ativo: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: "unidadeFederativa",
    timestamps: true,
  }
);

//faz o autoincremento de idUnidadeFederativa
UnidadeFerativaSchema.plugin(AutoIncrement(mongoose), {
  inc_field: "idUnidadeFederativa",
});

const UnidadeFederativa = mongoose.model(
  "unidadeFederativa",
  UnidadeFerativaSchema
);

export default UnidadeFederativa;
