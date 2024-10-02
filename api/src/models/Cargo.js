import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";

const CargoSchema = mongoose.Schema(
  {
    idCargo: {
      type: Number,
      unique: true,
    },
    nomeCargo: {
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
    collection: "cargo",
    timestamps: true,
  }
);

//faz o autoincremento de idCargo
CargoSchema.plugin(AutoIncrement(mongoose), { inc_field: "idCargo" });

const Cargo = mongoose.model("cargo", CargoSchema);

export default Cargo;
