const express = require("express");
const Cards = require("../models/Cards");
const auth = require("../middleware/auth.middleware");
const Cart = require("../models/Cart");
const router = express.Router({ mergeParams: true });


//get the user's cart
router.get("/", auth,  async (req, res) => {
  const {userId} = req.query;
  try {
      const cart = await Cart.findOne({userId });
  
  if (cart && cart.items.length > 0) {
       res.status(200).send(cart);
  } else {
        res.send(null);
  }
  } catch (error) {
      res.status(500).send();
  }
  });



//create a cart
router.post("/:itemId", auth, async (req, res) => {
  const {userId} = req.body;
  const quantity = 1;
  const { itemId } = req.params;
  try {
      const cart = await Cart.findOne({ userId });
      const item = await Cards.findOne({ _id: itemId });
  if (!item) {
      res.status(404).send({ message: "item not found" });
      return;
  }
      const price = item.price;
      const title = item.title;
      const image = item.imageUrl[0];
      const description = item.description;
  //If cart already exists for user,
  if (cart) {
      const itemIndex = cart.items.findIndex((item) => item.itemId ==  itemId);
  //check if product exists or not
  if (itemIndex > -1) {
    let item = cart.items[itemIndex];
    cart.totalPrice -= item.quantity * item.price;
    cart.totalQuantity -= item.quantity;
    cart.items.splice(itemIndex, 1);
    cart.totalPrice = cart.items.reduce((acc, curr) => {
return acc + curr.quantity * curr.price;
},0)
cart.totalQuantity = cart.items.reduce((acc, curr) => {
 return acc + curr.quantity;
 },0)
     await cart.save();
     res.status(200).send(cart);
  } else {
     cart.items.push({ itemId, title, image, quantity, price, description });
     cart.totalPrice = cart.items.reduce((acc, curr) => {
     return acc + curr.quantity * curr.price;
  },0)
  cart.totalQuantity = cart.items.reduce((acc, curr) => {
    return acc + curr.quantity;
},0)
     await cart.save();
     return res.status(200).send(cart);
  }
  } else {
  //no cart exists, create one
  const newCart = await Cart.create({
     userId,
     items: [{ itemId, title, image, quantity, price, description }],
     totalPrice: quantity * price,
     totalQuantity:quantity
  });
  return res.status(201).send(newCart);
  }
  
  } catch (error) {
     console.log(error);
     res.status(500).send("something went wrong");
  }
  });
//remove the ENTIRE product from the cart
  router.delete("/:itemId", auth, async (req, res) => {
    const {userId} = req.query;
    const {itemId} = req.params;
    try {
       let cart = await Cart.findOne({  userId});
       const itemIndex = cart.items.findIndex((item) => item._id == itemId);
    if (itemIndex > -1) {
         let item = cart.items[itemIndex];
         cart.totalPrice -= item.quantity * item.price;
         cart.totalQuantity -= item.quantity;
    if(cart.bill < 0) {
          cart.bill = 0
    }
         cart.items.splice(itemIndex, 1);
         cart.totalPrice = cart.items.reduce((acc, curr) => {
    return acc + curr.quantity * curr.price;
    },0)
    cart.totalQuantity = cart.items.reduce((acc, curr) => {
      return acc + curr.quantity;
      },0)
        cart = await cart.save();
        res.status(200).send(cart);
    } else {
        res.status(404).send("Product not found");
    }
    } catch (error) {
       console.log(error);
       res.status(400).send('Error removing product from cart');
    }
    });
//remove ONE UNIT of a product from the cart
    router.patch("/remove/:itemId", auth, async (req, res) => {
      const {userId} = req.body;
      const {itemId} = req.params;
      try {
         let cart = await Cart.findOne({  userId });
         const itemIndex = cart.items.findIndex((item) => item._id == itemId);
      if (itemIndex > -1) {
           let item = cart.items[itemIndex];
           item.quantity = item.quantity - 1;
           cart.totalPrice -= item.price;
           cart.totalQuantity--
          cart = await cart.save();
          res.status(200).send(cart);
      } else {
          res.status(404).send("Product not found");
      }
      } catch (error) {
         console.log(error);
         res.status(400).send('Error removing product from cart');
      }
      });
//adding ONE UNIT of a product from the cart
      router.patch("/add/:itemId", auth, async (req, res) => {
        const {userId} = req.body;
        const {itemId} = req.params;
        try {
           let cart = await Cart.findOne({  userId });
           const itemIndex = cart.items.findIndex((item) => item._id == itemId);
        if (itemIndex > -1) {
             let item = cart.items[itemIndex];
             item.quantity = item.quantity + 1;
             cart.totalPrice += item.price;
             cart.totalQuantity++
            cart = await cart.save();
            res.status(200).send(cart);
        } else {
            res.status(404).send("Product not found");
        }
        } catch (error) {
           console.log(error);
           res.status(400).send('Error adding product');
        }
      });

module.exports = router;
