const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const { create, productById, read, remove } = require("../controllers/product");

router.get("/product/:productId", read);
router.post("/product/create/:userId", isAdmin, isAuth, requireSignin, create);
router.delete(
  "/product/:productId/:userId",
  isAdmin,
  requireSignin,
  isAuth,
  remove
);

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;
