const express = require('express');
const router = express.Router();
const Booking = require('../model/Booking');
const { body, validationResult } = require('express-validator');

// POST route to book an expert
router.post('/book', [
  body('userId').not().isEmpty().withMessage('User ID is required'),
  body('expertId').not().isEmpty().withMessage('Expert ID is required'),
  body('date').isISO8601().withMessage('Invalid date format'),
  body('time').not().isEmpty().withMessage('Time is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, expertId, date, time } = req.body;

  try {
    const newBooking = new Booking({
      userId,
      expertId,
      date,
      time,
    });

    await newBooking.save();

    res.status(201).json({ message: 'Booking successful', booking: newBooking });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
