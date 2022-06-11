const router = require('express').Router();
const CryptoJs = require('crypto-js');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register page
router.post('/register', async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJs.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login In page

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.status(401).json('Wrong credentials');
      return;
    }

    const hashedPassword = CryptoJs.AES.decrypt(
      user.password,
      proccess.env.SECRET_KEY
    );

    const userPassword = hashedPassword.toString(CryptoJs.enc.Utf8);

    if (userPassword !== req.body.password) {
      res.status(401).json('Wrong credentials');
      return;
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_KEY,
      { expiresIn: '3d' }
    );

    // mongodb stores user inside _doc
    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
