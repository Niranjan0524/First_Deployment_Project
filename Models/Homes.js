const mongoose = require("mongoose");

// Define the schema
const homeSchema = new mongoose.Schema({
  houseName: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  rating: { type: Number, required: true },
  photo: { type: String, required: true },
  hostId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }
});


// Create the model
const Homes = mongoose.model( "Homes",homeSchema);

module.exports = Homes;
