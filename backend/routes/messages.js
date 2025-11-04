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
      read: false,
      delivered: true  // Mark as delivered immediately when sent
    });

    await newMessage.save();
    
    console.log('💬 MESSAGE SENT:');
    console.log(`   From: ${senderName}`);
    console.log(`   To: ${receiverId}`);
    console.log(`   Message: ${message.substring(0, 50)}...`);
    console.log('─────────────────────────────────────────');
    
    res.status(201).json({ message: 'Message sent successfully', data: newMessage });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Server error sending message' });
  }
});

// @route   PUT /api/messages/mark-read-batch
// @desc    Mark multiple messages as read
// @access  Private
// NOTE: This must come BEFORE /:id/read to avoid "mark-read-batch" being treated as an ID
router.put('/mark-read-batch', async (req, res) => {
  try {
    const { messageIds } = req.body;
    
    if (!messageIds || !Array.isArray(messageIds)) {
      return res.status(400).json({ error: 'Message IDs array required' });
    }

    await Message.updateMany(
      { _id: { $in: messageIds } },
      { read: true, readAt: new Date() }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark read batch error:', error);
    res.status(500).json({ error: 'Server error marking messages as read' });
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
    message.readAt = new Date();
    await message.save();
    
    console.log('✅ MESSAGE READ:');
    console.log(`   Message ID: ${req.params.id}`);
    console.log(`   Read At: ${message.readAt}`);
    console.log('─────────────────────────────────────────');

    res.json({ message: 'Message marked as read', data: message });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Server error marking message as read' });
  }
});

module.exports = router;
