export default function handler(req, res) {
  const quotes = [
    { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { quote: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
    { quote: "The mind is everything. What you think you become.", author: "Buddha" },
    { quote: "The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart.", author: "Helen Keller" },
    { quote: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  ];

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const selectedQuote = quotes[randomIndex];

  res.status(200).json(selectedQuote);
}
