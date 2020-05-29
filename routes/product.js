const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const {
  create,
  productById,
  read,
  remove,
  update,
  list,
} = require("../controllers/product");

router.get("/product/:productId", read);
router.post("/product/create/:userId", requireSignin, isAuth, isAdmin, create);
router.delete(
  "/product/:productId/:userId",
  isAdmin,
  requireSignin,
  isAuth,
  remove
);
router.put(
  "/product/:productId/:userId",
  isAdmin,
  requireSignin,
  isAuth,
  update
);

router.get("/products", list);

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;
