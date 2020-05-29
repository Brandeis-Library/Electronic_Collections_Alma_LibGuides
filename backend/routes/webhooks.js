const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
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
  var action = req.body.action.toLowerCase();
  switch (action) {
    default:
      console.log('No handler for type', action);
  }

  res.status(204).send();
});

module.exports = router;
