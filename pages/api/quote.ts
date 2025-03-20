type Quote = {
  quote: string;
  author: string;
};

import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse<Quote | { error: string }>) {
  const quotes: Quote[] = [
    { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { quote: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
    { quote: "The mind is everything. What you think you become.", author: "Buddha" },
    { quote: "The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart.", author: "Helen Keller" },
    { quote: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  ];

  if (req.query.author) {
    const author = req.query.author as string;
    const filteredQuotes = quotes.filter(quote => quote.author === author);

    if (filteredQuotes.length === 0) {
      return res.status(404).json({ error: `No quotes found for author: ${author}` });
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const selectedQuote: Quote = filteredQuotes[randomIndex];
    return res.status(200).json(selectedQuote);
  } else {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote: Quote = quotes[randomIndex];
    return res.status(200).json(selectedQuote);
  }
}
