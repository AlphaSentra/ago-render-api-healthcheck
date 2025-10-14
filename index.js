require('dotenv').config();
const axios = require('axios');
const cron = require('node-cron');

const URLs = process.env.URLS.split(',');

// Schedule health checks every 5 minutes
cron.schedule('*/5 * * * *', () => {
  URLs.forEach(url => {
    getHealth(url)
      .then(data => console.log(`Health check for ${url}:`, data))
      .catch(err => console.error(`Error checking ${url}:`, err));
  });
});

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
