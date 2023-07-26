
const express = require("express");
const router = express.Router({ mergeParams: true });

router.use("/auth", require("./auth.routes"));
router.use("/basket", require("./basket.routes"));
router.use("/order", require("./order.routes"));
router.use("/user", require("./user.routes"));
router.use("/cards", require("./cards.routes"));
router.use("/mainSlides", require("./mainSlides.routes"));

module.exports = router;
