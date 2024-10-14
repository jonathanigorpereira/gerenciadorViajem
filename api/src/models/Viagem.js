import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";

const ViagemSchema = new mongoose.Schema(
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
    idStatusViagem: {
      type: Number,
      require: true,
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
  {
    timestamps: true,
    collection: "viagem",
  }
);

ViagemSchema.plugin(AutoIncrement(mongoose), { inc_field: "idViagem" });

const Viagem = mongoose.model("viagem", ViagemSchema);
export default Viagem;
