const jwt = require('jsonwebtoken')
const User = require('../models/User')

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30d' })

// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already registered' })
    }

    const user = await User.create({ name, email, password })

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route   GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user })
}

module.exports = { register, login, getMe }