const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Simple in-memory data
let items = [
  { id: 1, text: 'Item one' },
  { id: 2, text: 'Item two' }
];

app.get('/health', (req, res) => {
  res.json({ status: 'OK', time: new Date().toISOString() });
});

app.get('/items', (req, res) => {
  res.json(items);
});

app.post('/items', (req, res) => {
  const { text } = req.body;
  const id = items.length + 1;
  items.push({ id, text });
  res.status(201).json({ id, text });
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});

