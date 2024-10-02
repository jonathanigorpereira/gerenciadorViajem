import mongoose, { mongo } from "mongoose";
import AutoIncrement from "mongoose-sequence";

const ViagemSchema = mongoose.Schema(
  {
    idViagem: {
      type: Number,
      unique: true,
    },
    idEmpregado: {
      type: Number,
      required: true,
    },
    idMunicipioSaida: {
      type: Number,
      required: true,
    },
    DataInicioViagem: {
      type: Date,
      required: true,
    },
    DataTerminoViagem: {
      type: Date,
      required: true,
    },
  },
  { collection: "viagem", timestamps: true }
);

ViagemSchema.plugin(AutoIncrement(mongoose), { inc_field: "idViagem" });

const Viagem = mongoose.model("viagem", ViagemSchema);

export default Viagem;
