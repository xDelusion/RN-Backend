const { model, Schema } = require("mongoose");

const TripSchema = new Schema(
  {
    title: { type: String, unique: true, required: true },
    description: { type: String, required: true },

    tripImage: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = model("Recipe", TripSchema);
