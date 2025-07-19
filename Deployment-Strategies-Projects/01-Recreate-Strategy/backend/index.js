// backend/index.js
const express = require('express');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: 5432
});

app.get('/api/hello', async (req, res) => {
  try {
    const result = await pool.query('SELECT message FROM greetings LIMIT 1');
    res.json({ message: result.rows[0].message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = 3000;
app.listen(port, () => console.log(`Backend listening on ${port}`));
