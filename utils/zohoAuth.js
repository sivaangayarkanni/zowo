const axios = require('axios');
require('dotenv').config();

// In-memory storage for access token and expiry
let accessToken = null;
let expiryTime = 0; // timestamp in ms

/**
 * Refreshes the Zoho access token using the refresh token
 * @returns {Promise<string>} new access token
 */
async function refreshAccessToken() {
  try {
    const response = await axios.post('https://accounts.zoho.com/oauth/v2/token', null, {
      params: {
        refresh_token: process.env.ZOHO_REFRESH_TOKEN,
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        grant_type: 'refresh_token'
      }
    });

    accessToken = response.data.access_token;
    // expires_in is in seconds; refresh 1 minute before expiry
    expiryTime = Date.now() + (response.data.expires_in * 1000) - 60000;

    console.log('✅ Access token refreshed successfully');
    return accessToken;

  } catch (error) {
    console.error('❌ Failed to refresh access token:', error.response?.data || error.message);
    throw new Error('Could not refresh Zoho access token');
  }
}

/**
 * Returns a valid Zoho access token
 * Automatically refreshes if expired or not set
 * @returns {Promise<string>}
 */
async function getAccessToken() {
  // If no token or expired, refresh it
  if (!accessToken || Date.now() > expiryTime) {
    return await refreshAccessToken();
  }
  return accessToken;
}

module.exports = { getAccessToken };