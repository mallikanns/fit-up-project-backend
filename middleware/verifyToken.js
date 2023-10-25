const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const tokenWithBearer = req.headers.authorization;

  if (!tokenWithBearer) {
    return res.status(403).json({ message: 'Token not provided' });
  }

  const token = tokenWithBearer.split(' ')[1];

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
