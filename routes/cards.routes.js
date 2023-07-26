const express = require("express");
const Cards = require("../models/Cards");

const router = express.Router({ mergeParams: true });

router.get("/", async (req, res) => {
  try {
    const {sizes,
      lowPrice,
      highPrice,
      fabric,
      brand,
      categoryId,
      sortType,
      searchValue,
      currentPage
      } = req.query;

   
      
      const brandArr = brand.split(',');
      const fabricArr = fabric.split(',');
      const sizeArr = sizes.split(',');
      var field = {};
      var sortObj = {};
      sortObj[sortType] = 1;
      if (categoryId>0) {
        field.category = categoryId;
      }
      if (searchValue) {
        field.title = { $regex: `${searchValue}`, $options: 'i' };
      }
      field.price = { $gt :  lowPrice, $lt : highPrice}
      field.fabric = { $in: fabricArr };
      field.brand = { $in: brandArr };
      field.sizes = { $all: sizeArr };
      //await Cards.createIndex({ title: "text"});
    const list = await Cards.find(field/*, { $text: { $search: searchValue } }*/)
    .sort(sortObj)
    .skip( currentPage > 0 ? (  currentPage * 10 ) : 0 )
    .limit(10);
    const count = await Cards.find(field/*, { $text: { $search: searchValue } }*/).countDocuments();
    
    res.status(200).send({list, totalPages: count/10});


  } catch (e) {
    res.status(500).json({
      message: "An error has occurred on the server. try later",
    });
  }
});
router.get("/all", async (req, res) => {
  try {
  
    const list = await Cards.find();
    res.status(200).send(list);
  } catch (e) {
    res.status(500).json({
      message: "An error has occurred on the server. try later",
    });
  }
});
router.get("/:cardId", async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Cards.findById(cardId);
    res.status(200).send(card);
  } catch (e) {
    res.status(500).json({
      message: "An error has occurred on the server. try later",
    });
  }
});



router.post("/", async (req, res) => {
  
  try {
    const newCard = await Cards.create({
      ...req.body,
    });
    
   
    res.status(201).send(newCard)
  } catch (e) {
    res.status(500).json({
      message: "An error has occurred on the server. try later",
    });
  }
})
router
  .route("/:cardId")
  .patch( async (req, res) => {
    try {
      const { cardId } = req.params;
      const newCard = await Cards.findByIdAndUpdate(cardId, req.body, {
        new: true,
      });
      
      res.status(201).send(newCard);
    } catch (e) {
      res.status(500).json({
        message: "An error has occurred on the server. try later",
      });
    }
  })

  .delete( async (req, res) => {
    try {
      const { cardId } = req.params;
      await Cards.findByIdAndDelete(cardId);
        return res.send("deleted");

    } catch (e) {
      res.status(500).json({
        message: "An error has occurred on the server. try later",
      });
    }
  });

module.exports = router;
