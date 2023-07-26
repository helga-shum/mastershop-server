const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    licence: { type: Boolean, required: true },
    admin:{type: Boolean},
    favorites: [{ type: Schema.Types.ObjectId, ref: "Cards" }]
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", schema);
