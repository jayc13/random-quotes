export default function handler(req, res) {
  res.status(200).json({ quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" });
}
