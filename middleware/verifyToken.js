const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const tokenWithBearer = req.headers.authorization;

  if (!tokenWithBearer) {
    return res.status(403).json({ message: 'Token not provided' });
  }

  // Extract the token without the 'Bearer ' prefix
  const token = tokenWithBearer.split(' ')[1];

  // Verify the token
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error(err); // Log the error for debugging purposes
      return res.status(401).json({ message: 'Token is not valid' });
    }
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
