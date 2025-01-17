const mongoose = require("mongoose");

// Define the schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, required: true, enum: ["host", "normal"] },
  favouritesHomes:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Homes"
      }
  ]
  //enum is used to specify the values that are allowed in the userType
});



// Create the model
const User = mongoose.model( "Users",UserSchema);

module.exports = User;
