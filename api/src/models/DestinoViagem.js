import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";

const DestinoViagemSchema = new mongoose.Schema(
  {
    idDestinoViagem: {
      type: Number,
      unique: true,
    },
    idViagem: {
      type: Number,
      required: true,
    },
    idMunicipioDestino: {
      type: Number,
      required: true,
    },
    DataDestinoViagem: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "destinosViagem",
  }
);

DestinoViagemSchema.plugin(AutoIncrement(mongoose), {
  inc_field: "idDestinoViagem",
});

const DestinoViagem = mongoose.model("DestinoViagem", DestinoViagemSchema);
export default DestinoViagem;
