require('dotenv').config();
const axios = require('axios');

const URLs = process.env.URLS.split(',');

module.exports = {
  sum,
  getHealth
};

async function getHealth(URL) {
  try {
    const res = await axios.get(URL);
    return res.data;
  } catch (error) {
    console.log(`🚀 ~ file: index.js:23 ~ error:`, error);
    throw error;
  }
}

// Simple function for testing
function sum(a, b) {
  return a + b;
}

