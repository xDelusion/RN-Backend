const express = require("express");
const router = express.Router();
const { register, login } = require("./auth.controllers");
const passport = require("passport");
const uploader = require("../../middlewares/uploader");

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  login
);

router.post("/register", uploader.single("image"), register);

module.exports = router;
