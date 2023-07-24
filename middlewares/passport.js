const { JWT_SECRET } = require("../config/keys");
const User = require("../db/models/User");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const { fromAuthHeaderAsBearerToken } = require("passport-jwt").ExtractJwt;

exports.localStrategy = new LocalStrategy(
  { usernameField: "email" },
  async (email, password, done) => {
    try {
      const foundUser = await User.findOne({ email: email });
      if (!foundUser) {
        return done({ message: "Wrong Email or Password" }, false);
      }
      const passwordsMatch = await bcrypt.compare(password, foundUser.password);
      if (!passwordsMatch) {
        return done({ message: "Wrong Email or Password" }, false);
      }

      // req.user = foundUser
      done(null, foundUser);
    } catch (error) {
      return done(error);
    }
  }
);

exports.jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  },
  async (jwtPayLoad, done) => {
    if (Date.now() > jwtPayLoad.exp * 1000) {
      return done(null, false);
    }
    try {
      const user = await User.findById(jwtPayLoad._id);

      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);
