const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// @route   GET /api/messages
// @desc    Get messages for a user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Server error fetching messages' });
  }
});

// @route   POST /api/messages
// @desc    Send a message
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { senderId, senderName, receiverId, message, timestamp } = req.body;

    if (!senderId || !senderName || !receiverId || !message) {
      return res.status(400).json({ error: 'Please fill all fields' });
    }

    const newMessage = new Message({
      senderId,
      senderName,
      receiverId,
      message,
      timestamp,
      read: false
    });

    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully', data: newMessage });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Server error sending message' });
  }
});

// @route   PUT /api/messages/:id/read
// @desc    Mark message as read
// @access  Private
router.put('/:id/read', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    message.read = true;
    await message.save();

    res.json({ message: 'Message marked as read', data: message });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Server error marking message as read' });
  }
});

module.exports = router;
