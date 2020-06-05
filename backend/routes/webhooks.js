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
router.post('/', async function (req, res, next) {
  console.log('Received webhook request not stringified', req.body);
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
  //console.log(
  //   'action, mmsID, hodingsURL=============  ',
  //   action,
  //   '  ',
  //   mmsID,
  //   '  ',
  //   holdingsURL
  // );
  let document = req.body.bib.anies;
  document = document.toString();
  console.log('document', document);
  // document = document.replace(/\[\'/g, "'");
  // document = document.replace(/\']/g, "'");
  // document = document.replace(/\\/g, '');
  //console.log('document post data removal-----', document);
  let xmlParsedDoc = await new dom().parseFromString(document);
  console.log('xmlParsedDoc', xmlParsedDoc);
  // 906
  let nodes906 = xpath.select('//datafield[@tag=906]/subfield', xmlParsedDoc);
  let nodes906Data = nodes906[0].toString();
  nodes906Data = nodes906Data.replace(/<subfield(.*?)>/g, '');
  nodes906Data = nodes906Data.replace(/<\/subfield>/g, '');
  // console.log('               ');
  // console.log('anies........', document);
  //console.log('nodes906Data', nodes906Data);
  // 520
  let nodes520 = xpath.select('//datafield[@tag=520]/subfield', xmlParsedDoc);
  let nodes520Data = nodes520[0].toString();
  nodes520Data = nodes520Data.replace(/<subfield(.*?)>/g, '');
  nodes520Data = nodes520Data.replace(/<\/subfield>/g, '');
  // 856
  let nodes856 = xpath.select('//datafield[@tag=856]/subfield', xmlParsedDoc);
  let nodes856Data = nodes856[1].toString();
  nodes856Data = nodes856Data.replace(/<subfield(.*?)>/g, '');
  nodes856Data = nodes856Data.replace(/<\/subfield>/g, '');

  switch (action) {
    case 'bib':
      console.log('               ');
      console.log('anies........', document);
      console.log('               ');
      console.log(
        `Type ${action}. mms_id = ${mmsID} holdingsURL = ${holdingsURL}`
      );
      console.log('nodes906Data', nodes906Data);
      console.log('nodes520Data', nodes520Data);
      console.log('nodes856Data', nodes856Data);
      break;
    default:
      console.log('No handler for type', action);
  }

  res.status(204).send();
});

module.exports = router;
