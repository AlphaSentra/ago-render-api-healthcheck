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
    const healthData = res.data;

    // GitHub Actions cleanup
    // Validate all required environment variables
    const requiredVars = {
      GITHUB_REPOSITORY_OWNER: process.env.GITHUB_REPOSITORY_OWNER,
      GITHUB_REPOSITORY: process.env.GITHUB_REPOSITORY,
      GITHUB_RUN_ID: process.env.GITHUB_RUN_ID,
      GITHUB_TOKEN: process.env.GITHUB_TOKEN
    };

    const missingVars = Object.entries(requiredVars)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
      process.exit(1);
    }

    const OWNER = requiredVars.GITHUB_REPOSITORY_OWNER;
    const REPO = requiredVars.GITHUB_REPOSITORY.split("/")[1];
    const CURRENT_RUN_ID = requiredVars.GITHUB_RUN_ID;
    const TOKEN = requiredVars.GITHUB_TOKEN;

    console.log(`Starting workflow cleanup for ${OWNER}/${REPO}`);
    const headers = {
      "Accept": "application/vnd.github+json",
      "Authorization": `Bearer ${TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28"
    };

    try {
      let page = 1;
      let totalDeleted = 0;
      let hasMore = true;

      while (hasMore) {
        const runsUrl = `https://api.github.com/repos/${OWNER}/${REPO}/actions/runs?per_page=100&page=${page}`;
        const response = await axios.get(runsUrl, { headers });
        const { workflow_runs: runs, total_count: totalCount } = response.data;

        if (!runs || runs.length === 0) {
          hasMore = false;
          continue;
        }

        console.log(`📄 Processing page ${page} (${runs.length} runs)`);
        
        let deletedInPage = 0;
        for (const run of runs) {
          const runId = String(run.id);
          if (runId === CURRENT_RUN_ID) {
            console.log(`⏩ Skipping current run ${runId}`);
            continue;
          }

          try {
            const deleteUrl = `https://api.github.com/repos/${OWNER}/${REPO}/actions/runs/${runId}`;
            await axios.delete(deleteUrl, { headers });
            console.log(`✅ Deleted run ${runId} (${run.status})`);
            deletedInPage++;
          } catch (err) {
            console.log(`⚠️ Failed to delete run ${runId}: ${err.response?.status} ${err.response?.data?.message || ''}`);
          }
        }

        totalDeleted += deletedInPage;
        console.log(`🧹 Page ${page} complete. Deleted ${deletedInPage} runs.`);
        
        // Check if we've processed all pages
        const processedCount = page * 100;
        if (processedCount >= totalCount) {
          hasMore = false;
        } else {
          page++;
        }
      }

      console.log(`🎉 Cleanup complete. Total deleted: ${totalDeleted} runs.`);
    } catch (err) {
      console.error(`❌ Fatal error: ${err.message}`);
      if (err.response) {
        console.error(`Status: ${err.response.status}`, `Data: ${JSON.stringify(err.response.data)}`);
      }
      process.exit(1);
    }

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
