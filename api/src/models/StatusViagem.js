import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";

const StatusViagemSchema = mongoose.Schema(
  {
    idStatusViagem: {
      type: Number,
      unique: true,
    },
    NomeStatusViagem: {
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
    collection: "statusViagem",
    timestamps: true,
  }
);

StatusViagemSchema.plugin(AutoIncrement(mongoose), {
  inc_field: "idStatusViagem",
});

const StatusViagem = mongoose.model("statusViagem", StatusViagemSchema);

export default StatusViagem;
