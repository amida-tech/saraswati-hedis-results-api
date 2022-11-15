const express = require('express');

const router = express(); // eslint-disable-line new-cap
const { getGoogleOAuthTokens } = require('../controllers/oauth2.controller');

router.get('/oauth/google', async (req, res) => {
   
})

module.exports = router;
