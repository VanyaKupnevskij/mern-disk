const Router = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const router = new Router();

router.post(
  '/registration',
  [
    check('email', 'Uncorrect email').isEmail(),
    check('password', 'Password must be longer than 3 and shorter then 12').isLength({
      min: 3,
      max: 12,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: errors.array(), message: 'Incorrect registration data' });
      }

      const { firstName, secondName, email, password } = req.body;

      const candidate = await User.findOne({ email });
      if (candidate) {
        return res.status(400).json({ message: `User with email ${email} already exist` });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ firstName, secondName, email, password: hashedPassword });
      await user.save();

      return res.status(201).json({ message: `User ${firstName} was created seccuful!` });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error registration', error });
    }
  },
);

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Failed login. Try again' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Failed login. Try again' });
    }

    const token = jwt.sign({ id: user.id }, config.get('secretJwt'), { expiresIn: '1h' });
    return res.json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        secondName: user.secondName,
        email: user.email,
        diskSpace: user.diskSpace,
        userSpace: user.usedSpace,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error login', error });
  }
});

module.exports = router;
