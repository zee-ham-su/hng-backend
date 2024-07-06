const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
require('dotenv').config();

module.exports = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.userId);
    if (!req.user) {
      return res.status(401).json({ message: 'Access denied, invalid token.' });
    }
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};
