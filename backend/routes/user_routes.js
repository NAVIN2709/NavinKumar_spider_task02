const express = require("express");
const router = express.Router();
const User = require("../models/user_model")

// POST a new user
router.post("/", async (req, res) => {
    try {
        console.log("New user registration");
        const { uid, name, email, photoURL } = req.body;

        const newUser = new User({
            uid,
            name,
            email,
            photoURL
        });

        await newUser.save();
        res.status(200).json(newUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

//Remove friend
router.put("/:id/remove-friend", async (req, res) => {
  const { friendId } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $pull: { friends: friendId } },
      { new: true }
    ).populate("friends", "name username email");

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to remove friend" });
  }
});

//Send friend request
router.put("/:id/send-request", async (req, res) => {
  const { targetId } = req.body;
  try {
    const user = await User.findById(req.params.id);
    const target = await User.findById(targetId);

    if (!user || !target) return res.status(404).json({ error: "User not found" });

    if (
      user.sentRequests.includes(targetId) ||
      user.friends.includes(targetId)
    ) {
      return res.status(400).json({ error: "Already requested or friends" });
    }

    user.sentRequests.push(targetId);
    target.friendRequests.push(user._id);

    await user.save();
    await target.save();

    res.json({ message: "Friend request sent" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send friend request" });
  }
});

// Accept friend request
router.put('/:id/accept-request', async (req, res) => {
  const { requesterId } = req.body;
  const user = await User.findById(req.params.id);
  const requester = await User.findById(requesterId);

  if (!user || !requester) return res.status(404).json({ error: "User not found" });

  user.friends.push(requesterId);
  requester.friends.push(user._id);

  user.friendRequests = user.friendRequests.filter(id => id.toString() !== requesterId);
  requester.sentRequests = requester.sentRequests.filter(id => id.toString() !== req.params.id);

  await user.save();
  await requester.save();

  res.json({ message: "Friend request accepted" });
});

// Reject/remove friend request
router.put('/:id/remove-request', async (req, res) => {
  const { requesterId } = req.body;
  const user = await User.findById(req.params.id);
  const requester = await User.findById(requesterId);

  if (!user || !requester) return res.status(404).json({ error: "User not found" });

  user.friendRequests = user.friendRequests.filter(id => id.toString() !== requesterId);
  requester.sentRequests = requester.sentRequests.filter(id => id.toString() !== req.params.id);

  await user.save();
  await requester.save();

  res.json({ message: "Friend request removed" });
});


// Get a user with populated friends, friendRequests, and sentRequests
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('friends', 'name email photoURL')
      .populate('friendRequests', 'name email photoURL')
      .populate('sentRequests', 'name email photoURL');

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});


//Update a user
router.put("/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Delete a user
router.delete("/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});

//Add user as friend
router.put("/:id/friends", async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, {
            $push: { friends: req.body.friends },
        });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'name email photoURL');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;