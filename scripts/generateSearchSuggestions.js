const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Load config
const configPath = path.resolve(__dirname, 'scriptConfigs.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const CSV_PATH = config.CSV_PATH;

const wordFrequency = {};

const bannedWords = "blue orange white per gal black".split(" ")
function processDescription(description) {
    // Normalize and split into words, filter out numbers and single characters
    return description
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 1 && !/^\d+$/.test(word))
        .filter(word => !bannedWords.includes(word))
}

const descriptions = [];

fs.createReadStream(CSV_PATH)
  .pipe(csv())
  .on('data', (row) => {
    if (row.description) {
      descriptions.push(row.description);
    }
  })
  .on('end', () => {
    descriptions.forEach(desc => {
      const words = processDescription(desc);
      words.forEach(word => {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      });
    });
    // Get top 20 words
    const topWords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word, count]) => ({ word, count }));
    // Output to JSON
    fs.writeFileSync(path.resolve(__dirname, 'searchSuggestions.json'), JSON.stringify(topWords, null, 2));
    console.log('Top 20 search suggestions written to searchSuggestions.json');
  });