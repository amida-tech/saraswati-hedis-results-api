// const axios = require('axios');
// const qs = require('qs');
const { googleClientID, googleClientSecret, googleOAuthRedirectUrl } = require('../config/config');
const logger = require('../config/winston');

const getGoogleOAuthTokens = async ({ code }) => {
  // const url = 'https://oauth2.googleapis.com/token';
  const values = {
    code,
    client_id: googleClientID,
    client_secret: googleClientSecret,
    redirect_uri: googleOAuthRedirectUrl,
    grant_type: 'authorization_code',
  };
  logger.info(values);
  // try {
  //     const res = await axios.post(url,qs.stringify(values),
  //     {
  //         headers : {
  //             "Content-Type": "application/x-www-form-urlencoded",
  //         }
  //     })
  //     return res.data
  // } catch (e) {
  //     logger.error(e);
  // }
};

module.exports = { getGoogleOAuthTokens };
