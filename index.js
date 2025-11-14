require('dotenv').config();
const axios = require('axios');
const cron = require('node-cron');

const URLs = process.env.URLS.split(',');

// Schedule health checks every 14 minutes (max 24 executions)
let executionCount = 0;

const job = cron.schedule('*/14 * * * *', () => {
  console.log(`Running health check #${executionCount + 1}`);
  
  URLs.forEach(url => {
    getHealth(url)
      .then(data => console.log(`Health check for ${url}:`, data))
      .catch(err => console.error(`Error checking ${url}:`, err));
  });

  executionCount++;
  
  if (executionCount >= 24) {
    console.log('Reached maximum 24 executions. Stopping job.');
    job.stop();
  }
});

module.exports = {
  sum,
  getHealth
};

async function getHealth(URL) {
  try {
    const res = await axios.get(URL);
    const healthData = res.data;
    return healthData;
  } catch (error) {
    console.log(`🚀 ~ file: index.js:23 ~ error:`, error);
    throw error;
  }
}

// Simple function for testing
function sum(a, b) {
  return a + b;
}
