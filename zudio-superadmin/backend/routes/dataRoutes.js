// ye sahi he bus ish me data status ke hisab se nahi he baki sab sahi he
// const express = require('express');
// const router = express.Router();
// const Data = require('../models/data'); // Replace with your model file path

// // Route to get all data
// router.get('/get-data/:id', async (req, res) => {
//   try {
//     const { id } = req.params; // Get ID from URL

//      // Find users where 'shopId' matches the URL ID
//      const data = await Data.find({ shopid: id });
  
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch data' });
//   }
// });

// module.exports = router;





const express = require('express');
const router = express.Router();
const Data = require('../models/data'); // Replace with your model file path

// Route to get all data
router.get('/get-data/:id', async (req, res) => {
  try {
    const { id } = req.params; // Get ID from URL

     // Find users where 'shopId' matches the URL ID
     const data = await Data.find({ shopid: id, status: 'pending' });
  
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});


// Route to update the status of a user to 'done' when the button is clicked
router.put('/update-status/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Update the user status to 'done'
    const updatedUser = await Data.findByIdAndUpdate(
      id, 
      { status: 'done' }, 
      { new: true } // Return the updated document
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

module.exports = router;
