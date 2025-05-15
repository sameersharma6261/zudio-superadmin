const express = require("express");
const router = express.Router();
const Shop = require("../models/Shop");

// ✅ Fetch all shops
router.get("/api/shops", async (req, res) => {
  try {
    const shops = await Shop.find();
    res.json(shops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// ✅ Add Menu Item to a Shop
router.post("/api/shops/:id/menu", async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    // Fix: Ensure shopss exists
    if (!shop.shopss) {
      shop.shopss = [];
    }

    shop.shopss.push(req.body);
    await shop.save();
    
    res.json({ message: "Menu item added successfully!", shop });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Menu Items of a Shop
router.get("/api/shops/:id/menu", async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    res.json(shop.shopss);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


// ✅ Fetch a single shop item along with menu items
router.get("/api/shops/:id", async (req, res) => {
    try {
      const shop = await Shop.findById(req.params.id);
      if (!shop) return res.status(404).json({ message: "Shop not found" });
  
      res.json(shop); // ✅ Send shopss along with shop details
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  

  // Update Menu Item
router.put("/api/update-menu-item/:shopId/:menushopssName", async (req, res) => {
  try {
    const { shopId, menushopssName } = req.params;
    const { newName, newLink, newDescription, newEmail, newPassword, newShopConPassword, newRole} = req.body;

    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({ message: "Shop item not found" });

    // Update the menu item
    const menuItem = shop.shopss.find((item) => item.name === menushopssName);
    if (!menuItem) return res.status(404).json({ message: "Menu item not found" });

    menuItem.name = newName;
    menuItem.link = newLink;
    menuItem.description = newDescription;
    menuItem.email = newEmail;
    menuItem.password = newPassword;
    menuItem.shopconpassword = newShopConPassword;
    menuItem.role = newRole;


    await shop.save(); // Save to MongoDB
    res.json({ success: true, message: "Menu item updated", shop });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});





// // ✅ Add new shop item
// router.post("/shops", async (req, res) => {
//   const { title, description, image} = req.body;
  
//   const shop = new Shop({
//     title,
//     description,
//     image,
//     shopss: [],
//   });

//   try {
//     const newShop = await shop.save();
//     res.status(201).json(newShop);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

module.exports = router;
