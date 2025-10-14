require('dotenv').config();
const cron = require('node-cron');
const axios = require('axios');

const URLs = process.env.URLS.split(',');

const CronExpression = {
  EVERY_14_MINUTES: '0 */14 * * * *',
};

// Create scheduler only in non-test environments
let scheduler;

if (process.env.NODE_ENV !== 'test') {
  scheduler = cron.schedule(CronExpression.EVERY_14_MINUTES, async () => {
    await Promise.all(URLs.map((url) => getHealth(url)));
  });
  scheduler.start();
}

module.exports = {
  sum,
  getHealth,
  scheduler: process.env.NODE_ENV === 'test' ? { stop: () => {} } : scheduler
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

