import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";

const TipoCustoSchema = mongoose.Schema(
  {
    idTipoCusto: {
      type: Number,
      unique: true,
    },
    NomeTipoCusto: {
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
    collection: "tipoCusto",
    timestamps: true,
  }
);

TipoCustoSchema.plugin(AutoIncrement(mongoose), {
  inc_field: "idTipoCusto",
});

const TipoCusto = mongoose.model("tipoCusto", TipoCustoSchema);

export default TipoCusto;
