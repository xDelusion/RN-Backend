const express = require("express");
const router = express.Router();
const { register, login } = require("./auth.controllers");
const passport = require("passport");

router.post("/register", register);

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  login
);

module.exports = router;
