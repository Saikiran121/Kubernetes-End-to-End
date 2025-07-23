const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/notesapp';
mongoose.connect(mongoUri)
  .then(() => console.log(`Connected to MongoDB at ${mongoUri}`))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Mongoose Schemas
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
});
const User = mongoose.model('User', userSchema);

const noteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  content: String,
});
const Note = mongoose.model('Note', noteSchema);

// Authentication Middleware
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Missing token' });
  const [type, token] = header.split(' ');
  if (type !== 'Bearer' || !token) return res.status(401).json({ error: 'Invalid auth header' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Signup route
app.post('/api/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: 'Username and password required' });

    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ error: 'Username taken' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hash });
    res.status(201).json({ message: 'User created' });
  } catch {
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: 'Username and password required' });

    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '2h' }
    );
    res.json({ token });
  } catch {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get all notes for logged-in user
app.get('/api/notes', auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.userId });
    res.json(notes);
  } catch {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// Create a new note
app.post('/api/notes', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await Note.create({
      user: req.user.userId,
      title,
      content,
    });
    res.status(201).json(note);
  } catch {
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// Update a note
app.put('/api/notes/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      req.body,
      { new: true }
    );
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch {
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// Delete a note
app.delete('/api/notes/:id', auth, async (req, res) => {
  try {
    const result = await Note.deleteOne({ _id: req.params.id, user: req.user.userId });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Note not found' });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

