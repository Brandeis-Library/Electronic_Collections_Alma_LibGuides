const express = require('express');
const router = express.Router();
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();


/* GET users listing. */
router.get('/collections', async function (req, res, next) {
  try {

    const { data } = await axios(process.env.EXLIBRIS_API_ROOT + process.env.EXLIBRIS_ALMA_COLLECTIONS_API_PATH + `?limit=10&offset=0&apikey=` + process.env.EXLIBRIS_ALMA_COLLECTIONS_API_KEY);
    res.send(data);
  } catch (error) {
    next(error)
  }
});

module.exports = router;
