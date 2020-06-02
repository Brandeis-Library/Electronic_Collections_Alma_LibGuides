const fs = require('fs');
const express = require('express');
const router = express.Router();
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;

let doc = '';

/* GET home page. */
router.get('/', async function (req, res, next) {
  fs.readFile('anies.txt', 'utf8', async function (err, document) {
    try {
      console.log('inside readfile.');

      document = document.replace(/\[\"/g, '"');
      document = document.replace(/\"]/g, '"');
      document = document.replace(/\\/g, '');
      console.log('document=======  ', document);
      let xmlParsedDoc = new dom().parseFromString(document);
      //console.log('xmlParsedDoc', xmlParsedDoc);
      let nodes = xpath.select('//datafield[@tag=906]/subfield', xmlParsedDoc);
      let nodesData = nodes[0].toString();
      console.log('nodes=====  ', nodesData);
      nodesData = nodesData.replace(/<subfield(.*?)>/g, '');
      nodesData = nodesData.replace(/<\/subfield>/g, '');
      console.log('nodes=====  ', nodesData);
      doc = nodesData;

      return res.render('index', { title: 'Express', txt: doc });
    } catch (err) {
      console.log(err);
    }
  });

  //console.log('doc', doc);
  //res.render('index', { title: 'Express', txt: doc });
});

module.exports = router;
