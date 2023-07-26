const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId, 
      required: true,
      ref: "User"
    },
    items:  [{
      itemId: {
       type: Schema.Types.ObjectId,
       ref: 'Cards',
       required: true
    },
    title: String,
    image: String,
    description: String,
    quantity: {
       type: Number,
       required: true,
       min: 1,
       default: 1},
       price: Number
     }],
    totalPrice: {
        type: Number,
        required: true,
       default: 0
      },
    totalQuantity: {
        type: Number,
        required: true,
       default: 0
      }
  },
  {
    timestamps: true,
  }
);

module.exports = model("Cart", schema);
