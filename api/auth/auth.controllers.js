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
    // overwrite and hash password
    const { password } = req.body;

    const passwordPattern = /[a-zA-Z0-9]{8,30}/;
    const isPasswordValid = passwordPattern.test(password);
    if (!isPasswordValid) {
      return res.status(403).json({
        message:
          "Password must at least 8 digits with a combination of numbers and letters.",
      });
    }

    if (req.file) {
      req.body.image = `${req.file.path.replace("\\", "/")}`;
    }

    req.body.password = await hashPassword(password);

    // Existing User error
    const existingEmailOrUsername = await User.findOne({
      email: req.body.email,
      username: req.body.username,
    });
    if (existingEmailOrUsername) {
      return res
        .status(403)
        .json({ message: "Email or username already exists" });
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
