const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth.middleware");
const Cart = require("../models/Cart");
const Orders = require("../models/Orders");
const router = express.Router({ mergeParams: true });

//get user orders
router.get('/', auth, async (req, res) => {
 const {userId}  = req.query;
  try {
      const order = await Orders.find({ userId });
      if(order) {
          return res.status(200).send(order)
      }
      res.status(404).send('Orders not found')
  } catch (error) {
      res.status(500).send('Error getting user orders')
  }
})
//updating order data
//In delivery->received
router.patch('/:orderId', auth, async (req, res) => {
  const {orderId} = req.params
  try {
         await Orders.findByIdAndUpdate(orderId, {
          isDelivered:true
        });
        return res.status(200)
     
  } catch (error) {
      res.status(500).send('Order data change error')
  }
})


//create order and delete cart
router.post('/checkout', async(req, res) => {
  try {
    const {deliveryDate, currentDate, userId} = req.body
      //find cart and user 
      let cart = await Cart.findOne({userId})
      let user = await User.findById(userId)
      
      if(cart) {
          const order = await Orders.create({
          userId:userId,
          items: cart.items,
          totalPrice: cart.totalPrice,
          totalQuantity: cart.totalQuantity,
          isDelivered:false,
          orderDate: currentDate,
          deliveryDate:deliveryDate,
          orderAddress:user.address
          })
          const orders = await Orders.find({ userId });

                  //delete cart
                 await Cart.findByIdAndDelete({_id: cart._id})
                  return res.status(201).send(orders)     
          }
  } catch (error) {
      console.log(error)
      res.status(400).send('Order creation error')
  }
})







module.exports = router;
