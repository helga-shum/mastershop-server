
const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    image: {
      type: String,
      required: true,
    },
    cardId: {
// Added slide links to cards
      type: Schema.Types.ObjectId,
      ref: "Cards",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("CardSlides", schema);
