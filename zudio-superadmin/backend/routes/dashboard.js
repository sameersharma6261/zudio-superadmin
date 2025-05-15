const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop');
const PhoenixUser = require('../models/data'); // your user model

// Helper function to count counters in a mall's shops
router.get('/stats', async (req, res) => {
  try {
    const shops = await Shop.find();
    const users = await PhoenixUser.find();

    // Filter malls (owners only)
    const malls = shops.filter(shop => shop.role === 'owner');

    // Total malls
    const totalMalls = malls.length;

    // Total users
    const totalUsers = users.length;

    // Total counters count = sum of all nested shops with role 'shop'
    let totalCounters = 0;

    // Counters per mall
    const countersPerMall = {};

    malls.forEach(mall => {
      let count = 0;
      if (Array.isArray(mall.shopss)) {
        count = mall.shopss.filter(s => s.role === 'shop').length;
      }
      countersPerMall[mall.title || mall._id] = count;
      totalCounters += count;
    });

    // Location stats from malls only
    const locations = {
      countries: {},
      states: {},
      cities: {},
    };

    malls.forEach(mall => {
      const { country, state, city } = mall.location || {};
      if (country) locations.countries[country] = (locations.countries[country] || 0) + 1;
      if (state) locations.states[state] = (locations.states[state] || 0) + 1;
      if (city) locations.cities[city] = (locations.cities[city] || 0) + 1;
    });

    res.json({
      totalMalls,
      totalUsers,
      totalCounters,
      countersPerMall,
      locations,
    });

  } catch (err) {
    console.error("Error in /stats:", err);
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;