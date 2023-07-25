const express = require("express");
const connectDb = require("./database");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandle");
const config = require("./config/keys");
const passport = require("passport");
const { localStrategy, jwtStrategy } = require("./middlewares/passport");
const path = require("path");
const authRoutes = require("./api/auth/auth.routes");
const tripRoutes = require("./api/trip/trip.routes");

app.use(cors());
connectDb();
app.use(express.json());
app.use(morgan("dev"));

app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);
app.use("/api/trip", tripRoutes);
app.use("/api/auth", authRoutes);
app.use("/media", express.static(path.join(__dirname, "media")));
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`App running on PORT:${PORT}`);
});

module.exports = app;
