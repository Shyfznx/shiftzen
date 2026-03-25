const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, '../frontend')));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shiftzen')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

app.use('/api/auth',      require('./routes/auth'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/projects',  require('./routes/projects'));
app.use('/api/interests', require('./routes/interests'));

app.get('/portfolio/:customURL', (_req, res) =>
  res.sendFile(path.join(__dirname, '../frontend/portfolio.html')));

app.use((err, _req, res, _next) => res.status(500).json({ error: err.message }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ShiftZen running on http://localhost:${PORT}`));
