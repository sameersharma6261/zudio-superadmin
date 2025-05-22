// const mongoose = require("mongoose");

// const ShopSchema = new mongoose.Schema({
//   title: String,
//   description: String,
//   image: String,
//   email: String,
//   password: String,
//   role: String,
//   mallconpassword: String,
//   location: {
//     country: String,
//     state: String,
//     city: String,
//     street: String,
//     latitude: Number, 
//     longitude: Number,
//   },
//   shopss: [
//     {
//       name: String,
//       image: String,
//       description: String,
//       link: String,
//       email: String,
//       password: String, 
//       role: String,
//       shopconpassword: String,
//     },
//   ],
// },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Food", ShopSchema);



const mongoose = require("mongoose");

// Sub-schema for individual shops inside 'shopss'
const ShopSubSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  link: String,
  email: String,
  password: String,
  role: String,
  shopconpassword: String,
}, { timestamps: true });  // <-- timestamps enabled here

const ShopSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  email: String,
  password: String,
  role: String,
  mallconpassword: String,
  location: {
    country: String,
    state: String,
    city: String,
    street: String,
    latitude: Number,
    longitude: Number,
  },
  shopss: [ShopSubSchema],  // <-- use sub-schema here
}, { timestamps: true });

module.exports = mongoose.model("Food", ShopSchema);