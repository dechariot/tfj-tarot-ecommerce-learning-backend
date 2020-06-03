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
  listRelatedProducts,
  listCategories,
  listBySearch,
  productPhoto,
  listSearch
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
router.get("/products/search", listSearch);
router.get("/products/related/:productId", listRelatedProducts);
router.get("/products/categories", listCategories);
router.post("/products/by/search", listBySearch);
router.get("/product/photo/:productId", productPhoto);

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;
