const jwt = require('jsonwebtoken');
const SECRET = 'SECr3t'; 

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("chala");   
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    console.log(token);
    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = {
    authenticateJwt,
    SECRET
}
