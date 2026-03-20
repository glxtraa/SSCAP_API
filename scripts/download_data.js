const { createClient } = require('@vercel/kv');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function downloadData() {
  const kv = createClient({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });

  console.log('Fetching all keys from Vercel KV...');
  
  let allData = [];
  let cursor = '0';

  try {
    do {
      const [nextCursor, keys] = await kv.scan(cursor, { match: 'sscap:*', count: 100 });
      cursor = nextCursor;

      for (const key of keys) {
        const value = await kv.get(key);
        allData.push({ key, value });
      }
    } while (cursor !== '0');

    const outputPath = path.join(__dirname, '..', 'data_backup.json');
    fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2));
    
    console.log(`Success! ${allData.length} records downloaded to ${outputPath}`);
  } catch (error) {
    console.error('Error downloading data:', error.message);
    console.log('\nMake sure you have KV_REST_API_URL and KV_REST_API_TOKEN in your .env file.');
  }
}

downloadData();
