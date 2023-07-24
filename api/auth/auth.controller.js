const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../db/models/User");
const { JWT_SECRET, JWT_EXP } = require("../../config/keys");

const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

const createToken = (user) => {
  const payload = {
    _id: user._id,
    username: user.username,
    email: user.email,
  };
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXP,
  });
  return token;
};

exports.register = async (req, res, next) => {
  try {
    console.log(req.body.isStaff);

    // overwrite and hash password
    const { password, confirmPass } = req.body;

    // Password validation
    if (password !== confirmPass) {
      return res.status(403).json({ message: "Password doesn't match" });
    }

    const passwordPattern = /[a-zA-Z0-9]{8,30}/;
    const isPasswordValid = passwordPattern.test(password);
    if (!isPasswordValid) {
      return res.status(403).json({
        message:
          "Password must at least 8 digits with a combination of numbers and letters.",
      });
    }

    req.body.password = await hashPassword(password);
    delete req.body.isStaff;

    // Existing User error
    const existingEmail = await User.findOne({ email: req.body.email });
    if (existingEmail) {
      return res.status(403).json({ message: "Email already exists" });
    }

    const existingUsername = await User.findOne({
      username: req.body.username,
    });
    if (existingUsername) {
      return res.status(403).json({ message: "Username already exists" });
    }

    // Create User
    const newUser = await User.create(req.body);

    // Create token
    const token = createToken(newUser);

    // return token
    return res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

exports.login = (req, res, next) => {
  const token = createToken(req.user);
  return res.status(200).json({ token });
};
