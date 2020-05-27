const express = require("express");
const router = express.Router();

const {
  signup,
  signin,
  signout,
  requireSignin,
} = require("../controllers/auth");
const { userSignupValidator } = require("../validator/index");

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin); //able to add validator next time
router.get("/signout", signout);

// router.get("/greeting", requireSignin, (req, res) => {
//   res.send("Hi Dev!");
// });

module.exports = router;
