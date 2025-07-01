const express = require("express");
const Group = require("../models/group_model");

const router = express.Router();

// Create a group
router.post('/', async (req, res) => {
  try {
    const group = new Group(req.body);
    const savedGroup = await group.save();
    res.status(201).json(savedGroup);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create group' });
  }
});

// Get all groups the user is a member or creator of
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const groups = await Group.find({
      $or: [{ members: userId }, { creator: userId }],
    });

    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user groups' });
  }
});



// Get a specific group's details
router.get('/:groupId', async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate('expenses.user', 'name') 
      .populate('members', 'name');
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch group' });
  }
});

// Add an expense to a group
router.post("/:id/expenses", async (req, res) => {
  const { user, amount,remarks } = req.body;
  try {
    const group = await Group.findById(req.params.id);
    group.expenses.push({ user, amount, remarks });
    await group.save();
    res.status(201).json(group.expenses[group.expenses.length - 1]);
  } catch (err) {
    res.status(500).json({ error: "Failed to add expense" });
  }
});


module.exports = router;