const { list } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Note: @vercel/blob's 'list' and manual 'fetch' are used here.
// You must have BLOB_READ_WRITE_TOKEN in your .env file.

async function downloadData() {
  console.log('Fetching all blobs from Vercel Blob...');
  
  let allData = [];
  let hasMore = true;
  let cursor = undefined;

  try {
    while (hasMore) {
      const response = await list({
        prefix: 'sscap/',
        cursor,
    token: process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_PUBLIC_READ_WRITE_TOKEN,
      });

      for (const blob of response.blobs) {
        console.log(`Downloading ${blob.pathname}...`);
        const res = await fetch(blob.url);
        const data = await res.json();
        allData.push({ pathname: blob.pathname, data });
      }

      hasMore = response.hasMore;
      cursor = response.cursor;
    }

    const outputPath = path.join(__dirname, '..', 'data_backup.json');
    fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2));
    
    console.log(`\nSuccess! ${allData.length} records downloaded to ${outputPath}`);
  } catch (error) {
    console.error('Error downloading data:', error.message);
    console.log('\nMake sure you have BLOB_READ_WRITE_TOKEN in your .env file.');
  }
}

downloadData();
