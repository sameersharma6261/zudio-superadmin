// ye sahi he bus ish me data status ke hisab se nahi he baki sab sahi he
// const mongoose = require('mongoose');


// const userTokenSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   mobile: {
//     type: String,
//     required: true
//   },
//   email: {
//     type: String,
//     required: true
//   },  
//   token: {
//     type: String,
//     required: true
//   },
//   shopid: {
//     type: String,
//     required: true
//   }
// },
// {
//   timestamps:true
// });

// const User = mongoose.model('PhoenixUser', userTokenSchema);
// module.exports = User;



const mongoose = require('mongoose');


const userTokenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },  
  token: {
    type: String,
    required: true
  },
  shopid: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'pending'  // Default status is 'pending'
  }
},
{
  timestamps:true
}
);

const User = mongoose.model('PhoenixUser', userTokenSchema);
module.exports = User;
