const express = require('express');
const router = express.Router();
const Interest = require('../models/Interest');
const auth = require('../middleware/auth');

router.get('/:userId', async (req, res) => {
  try { res.json(await Interest.findOne({ userId: req.params.userId }) || {}); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/youtube', auth, async (req, res) => {
  try {
    let i = await Interest.findOne({ userId: req.userId }) || new Interest({ userId: req.userId });
    i.youtubeLinks.push(req.body.url); await i.save(); res.json(i);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/article', auth, async (req, res) => {
  try {
    let i = await Interest.findOne({ userId: req.userId }) || new Interest({ userId: req.userId });
    i.articlesRead.push({ title: req.body.title, url: req.body.url }); await i.save(); res.json(i);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
