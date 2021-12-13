const express = require("express");
const Log = require("../models/log");
const User = require("../models/user");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/logs", auth, async (req, res) => {
  const log = new Log({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await log.save();
    res.status(201).send(log);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/logs", auth, async (req, res) => {
  try {
    const logs = await Log.find({ owner: req.user._id });
    // await req.user.populate('logs').execPopulate()
    // const logs = req.user.logs

    const newLogs = logs.map(async (log) => {
      const owner = await User.findById({ _id: log.owner });
      const ownerName = owner.name ?? owner.email;
      return { ...log._doc, ownerName };
    });

    res.send(await Promise.all(newLogs));
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/logs/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const log = await Log.findOne({
      _id,
      owner: req.user._id,
    });

    if (!log) {
      return res.status(404).send();
    }
    res.send(log);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/logs/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["isPublic", "action", "symbol", "amount", "profitOrLoss", "date", "note"];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const log = await Log.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!log) {
      return res.status(404).send();
    }

    updates.forEach((update) => (log[update] = req.body[update]));
    await log.save();
    res.send(log);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/logs/:id", auth, async (req, res) => {
  try {
    const log = await Log.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!log) {
      res.status(404).send();
    }

    res.send(log);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
