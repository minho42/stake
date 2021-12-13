const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    // const token = await user.generateAuthToken();
    // if (!token) {
    //   throw new Error("no token");
    // }
    res.status(201).send({ user });
  } catch (e) {
    console.log(e);
    await user.remove();
    res.status(400).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();

    res.cookie("token", token, {
      httpOnly: true,
      // secure: true,
      // maxAge: 1000000,
      // signed: true,
    });
    // console.log(req.cookies);
    res.send({ user });
  } catch (error) {
    // console.log(error);
    res.status(400).send();
  }
});

router.post("/users/password/reset", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error("Couldn't find that email");
    }
    const token = await user.generatePasswordResetToken();
    console.log("passwordResetToken: " + token);
    // TODO
    res.send({ user });
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/users/password/reset/confirm", async (req, res) => {
  try {
    const user = await User.findOne({ passwordResetToken: req.body.token });
    if (!user) {
      throw new Error("Token not valid");
    }
    console.log("token valid, can proceed to change password");
    res.send({ user });
    // TODO Need to remove passwordResetToken once password reset
  } catch (error) {
    res.status(400).send();
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.clearCookie("token");
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/users/logoutall", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.clearCookie("token");
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/users/check", auth, async (req, res) => {
  res.send(req.user);
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password"];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.clearCookie("token");
    res.send(req.user);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

module.exports = router;
