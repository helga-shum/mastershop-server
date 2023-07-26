const express = require("express");
const MainSlides = require("../models/MainSlides");
const router = express.Router({ mergeParams: true });

router.get("/", async (req, res) => {
  try {
    const list = await MainSlides.find();
    res.status(200).send(list);
  } catch (e) {
    res.status(500).json({
      message: "An error has occurred on the server. try later",
    });
  }
});

module.exports = router;
