const fs = require('fs');
const express = require('express');
const router = express.Router();

const parser = require('xml2json');

let doc = '';

/* GET home page. */
router.get('/', async function (req, res, next) {
  fs.readFile('anies.txt', 'utf8', async function (err, data) {
    try {
      console.log('inside readfile.');

      data = data.replace(/\\/g, '');
      console.log('data=======  ', data);
      doc = data;
      //JSON.parse(parser.toJson(data, { reversible: true }));
      //console.log('data2+++++++++  ', data2);
      //return data2;
    } catch (err) {
      console.log(err);
    }
  });

  //json = await json.replace(/\\/g, '++++');
  console.log('doc', doc);
  res.render('index', { title: 'Express', txt: doc });
});

module.exports = router;
