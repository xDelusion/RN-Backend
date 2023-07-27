const express = require("express");
const router = express.Router();
const passport = require("passport");
const upload = require("../../middlewares/uploader");
const {
  fetchTrip,
  addTrip,
  getTrips,
  updateTrip,
  deleteTrip,
} = require("./trip.controllers");

router.param("tripId", async (req, res, next, tripId) => {
  try {
    const trip = await fetchTrip(tripId, next);
    if (!trip)
      return res.status(404).json({
        msg: "There is no trip with this id",
      });
    req.trip = trip;
    next();
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  addTrip
);

router.get("/", getTrips);
router.put(
  "/:tripId",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  updateTrip
);

router.delete(
  "/delete/:tripId",
  passport.authenticate("jwt", { session: false }),
  deleteTrip
);

module.exports = router;
