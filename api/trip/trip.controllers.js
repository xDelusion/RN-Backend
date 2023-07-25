const Trip = require("../../db/models/Trip")


exports.fetchTrip = async (tripId, next) => {
    try {
      const trip = await Trip.findById(tripId);
      return trip;
    } catch (error) {
      return next(error);
    }
  };



  exports.getTrips = async (req, res, next) => {
    try {
      const trips = await Trip.find()
        .select("-__v")
        .populate("creator", "username image");
      return res.status(200).json(trips);
    } catch (error) {
      return next({ status: 400, message: error.message });
    }
  };


  