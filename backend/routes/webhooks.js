const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const crypto = require('crypto');

// Load configuration

function validateSignature(body, secret, signature) {
  var hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(body))
    .digest('base64');
  return hash === signature;
}

/*
GET - Challenge
*/
router.get('/', function (req, res, next) {
  console.log('Alma Webhooks challenge', req.query.challenge);
  res.json({ challenge: req.query.challenge });
});

/*
POST - Handle webhook
*/
router.post('/', function (req, res, next) {
  console.log('Received webhook request:', JSON.stringify(req.body));

  // Validate signature
  var secret = process.env.WEBHOOK_SECRET;
  if (!validateSignature(req.body, secret, req.get('X-Exl-Signature'))) {
    console.log('did not validate request');
    return res.status(401).send({ errorMessage: 'Invalid Signature' });
  }
  console.log('validated signature');
  // Handle webhook
  const action = req.body.action.toLowerCase();
  const mmsID = req.body.bib.mms_id;
  const holdingsURL = req.body.bib.holdings.link;
  console.log(
    'action, mmsID, hodingsURL=============  ',
    action,
    '  ',
    mmsID,
    '  ',
    holdingsURL
  );
  const document = req.body.bib.anies;
  console.log('document', document);
  document = document.replace(/\[\'/g, '"');
  document = document.replace(/\']/g, '"');
  document = document.replace(/\\/g, '');
  let xmlParsedDoc = new dom().parseFromString(document);
  let nodes = xpath.select('//datafield[@tag=906]/subfield', xmlParsedDoc);
  let nodesData = nodes[0].toString();
  nodesData = nodesData.replace(/<subfield(.*?)>/g, '');
  nodesData = nodesData.replace(/<\/subfield>/g, '');
  console.log('               ');
  console.log('anies........', document);
  console.log('nodesData', nodesData);
  switch (action) {
    case 'bib':
      console.log(
        `Type ${action}. mms_id = ${mmsID} holdingsURL = ${holdingsURL}`
      );
      console.log('               ');
      console.log('anies........', anies);
      console.log('nodesData', nodesData);

    default:
      console.log('No handler for type', action);
  }

  res.status(204).send();
});

module.exports = router;
