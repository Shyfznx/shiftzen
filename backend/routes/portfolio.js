const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const auth = require('../middleware/auth');

router.get('/user/:userId', async (req, res) => {
  try { res.json(await Portfolio.findOne({ userId: req.params.userId }) || {}); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:customURL', async (req, res) => {
  try {
    const p = await Portfolio.findOne({ customURL: req.params.customURL })
      .populate('userId', 'username email avatar bio');
    if (!p) return res.status(404).json({ error: 'Not found' });
    p.viewCount += 1; await p.save(); res.json(p);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    let p = await Portfolio.findOne({ userId: req.userId });
    if (p) { Object.assign(p, req.body); p.updatedAt = new Date(); }
    else p = new Portfolio({ userId: req.userId, ...req.body });
    await p.save(); res.json(p);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
