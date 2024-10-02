import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";

const MunicipioSchema = new mongoose.Schema(
  {
    idMunicipio: {
      type: Number,
      unique: true,
    },
    NomeMunicipio: {
      type: String,
      unique: true,
      required: true,
      maxlength: 45,
    },
    idUnidadeFederativa: {
      type: Number,
      required: true,
    },
    ativo: {
      type: Boolean,
      default: true,
    },
  },
  { collection: "municipio", timestamps: true }
);

MunicipioSchema.plugin(AutoIncrement(mongoose), { inc_field: "idMunicipio" });

const Municipio = mongoose.model("municipio", MunicipioSchema);

export default Municipio;
