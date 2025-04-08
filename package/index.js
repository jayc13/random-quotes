import fetch from 'node-fetch';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .option('category', {
    alias: 'c',
    describe: 'Filter quotes by category',
    type: 'string',
  })
  .help()
  .argv;

const fetchQuote = async () => {
  let url = 'http://localhost:3000/api/quotes'; // Assuming the API runs locally on port 3000
  if (argv.category) {
    url += `?category=${argv.category}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data && data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.length);
      const quote = data[randomIndex];
      console.log(quote.text);
      console.log(`- ${quote.author}`);
    } else {
      console.log('No quotes found.');
    }
  } catch (error) {
    console.error('Error fetching quote:', error);
  }
};

fetchQuote();
