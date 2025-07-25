const bcrypt = require('bcryptjs');
const userRegister = require('../models/registerUser');
const generateToken = require('../config/token');


exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password, confirmpassword } = req.body;

    if (!firstName || !lastName || !email || !phoneNumber || !password || !confirmpassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (password !== confirmpassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    const existingUser = await userRegister.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email or phone already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userRegister.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        _id: newUser._id,
        name: newUser.firstName + ' ' + newUser.lastName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        token: generateToken(newUser._id),
      },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    const user = await userRegister.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.firstName + ' ' + user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        token: generateToken(user._id),
      },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};