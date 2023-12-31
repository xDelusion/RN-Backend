const Trip = require("../../db/models/Trip");

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

exports.addTrip = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `${req.file.path.replace("\\", "/")}`;
    }
    console.log(req.body);
    const trip = await Trip.create(req.body);

    await req.user.updateOne({
      $push: { trips: trip._id },
    });
    res.status(201).json(trip);
    next(error);
  } catch (error) {
    next(error);
  }
};

exports.upadateTrip = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    if (req.file) {
      req.body.tripimage = `${req.file.path}`;
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      res.status(404).json({ message: "trip not found" });
    } else {
      if (req.user._id.equals(trip.creator)) {
        await trip.updateOne(req.body);
        return res.status(200).json({ message: "trip updated successfully" });
      }
      return res
        .status(401)
        .json({ message: "you are not the creater of the trip" });
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteTrip = async (req, res, next) => {
  try {
    if (!req.user._id.equals(req.trip.creator))
      return next({
        status: 400,
        message: "You are not authorized to delete this trip",
      });

    const trip = await Trip.findById(req.trip._id);
    await req.trip.deleteOne(trip);
    return res.status(204).end();
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

exports.getTripById = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const trip = await Trip.findById(tripId).populate("creator");
    res.status(200).json(trip);
  } catch (error) {
    next(error);
  }
};
// exports.deleteTrip = async (req, res, next) => {
//   try {
//     if (!req.user.username) {
//       return res
//         .status(401)
//         .json({ message: "You are not authourized to delete this trip" });
//     }

//     const { tripId } = req.params;

//     let trip = await Trip.findByIdAndDelete(tripId);

//     if (Trip.creator !== req.user.id) {
//       return res
//         .status(401)
//         .json({ message: "You are not authorized to delete this trip" });
//     }

// if (!trip) {
//   return res.status(404).json({ message: "Trip not found" });
// }

// return res.status(200).json({ message: "Trip deleted successfully" });
//   } catch (error) {
//     return next(error);
//   }
// };
