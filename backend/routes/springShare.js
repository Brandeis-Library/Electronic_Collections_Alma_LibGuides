const express = require('express');
const router = express.Router();
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

/* GET all assests  */
router.get('/assets', async function (req, res, next) {
  try {
    const { data } = await axios(
      `${process.env.SPRINGSHARE_ASSETS_API_ROOT}?site_id=${process.env.SPRINGSHARE_ASSETS_API_ID}&key=${process.env.SPRINGSHARE_ASSETS_API_KEY}`
    );
    console.log('data....', data);
    var cache = [];
    const data2 = JSON.stringify(data, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        // Duplicate reference found, discard key
        if (cache.includes(value)) return;

        // Store value in our collection
        cache.push(value);
      }
      return value;
    });
    cache = null;
    res.json(data2);
  } catch (error) {
    next(error);
  }
});

/* GET a single asset by id */
router.get('/assets/:id', async function (req, res, next) {
  try {
    const { data } = await axios(
      `${process.env.SPRINGSHARE_ASSETS_API_ROOT}/${req.params.id}?site_id=${process.env.SPRINGSHARE_ASSETS_API_ID}&key=${process.env.SPRINGSHARE_ASSETS_API_KEY}`
    );

    res.json(data);
  } catch (error) {
    next(error);
  }
});

/* PUT - Update a single asset */
router.put('/assets/', function (req, res, next) {
  const title = req.query.title;
  console.log('title', title);
  res.json({ title });
});

module.exports = router;
