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

    const trip1 = await Trip.create(req.body);
    res.status(201).json(trip1);
    next(error);

    const trip = await Trip.create({
      title: req.body.title,
      description: req.body.description,
      tripImage: req.body.tripImage,
    });

    await trip.save();
    return res.status(201).json(trip);
  } catch (error) {}
};

exports.updateTrip = async (req, res, next) => {
  try {
    await req.trip.updateOne(req.trip);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};
