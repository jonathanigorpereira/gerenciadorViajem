import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";

const CustoDestinoSchema = new mongoose.Schema(
  {
    idCustoDestino: {
      type: Number,
      unique: true,
    },
    idDestinoViagem: {
      type: Number,
      required: true,
    },
    idTipoCusto: {
      type: Number,
      required: true,
    },
    ValorCustoDestino: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "custosDestino",
  }
);

CustoDestinoSchema.plugin(AutoIncrement(mongoose), {
  inc_field: "idCustoDestino",
});

const CustoDestino = mongoose.model("CustoDestino", CustoDestinoSchema);
export default CustoDestino;
