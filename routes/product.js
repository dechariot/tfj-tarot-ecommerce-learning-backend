const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const { create, productById, read } = require("../controllers/product");

router.get("/product/:productId", read);
router.get("/secret/:userId", requireSignin, isAuth, isAdmin, (req, res) => {
  res.json({
    user: req.profile,
  });
});

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;
