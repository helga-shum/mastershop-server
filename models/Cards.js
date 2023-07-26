const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    imageUrl: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    sizes: {
      type: Array,
      required: true,
    },
    fabric: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default:0
    },
    order_number: {
      type: Number,
      default:0
    },
    description: {
      type: String,
      required: true,
    },
    measures: {
      type: Array,
      default:[]
    },
    procent: {
      type: Number,
      default:0
    },
  },
  { timestamps: true },
);

module.exports = model('Cards', schema);
