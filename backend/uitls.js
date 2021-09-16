const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const createToken = user => {
  
  return jwt.sign(
    {
      sub: user._id,
      email: user.email,
      phoneNo:user.phoneNo
    },
    "omaewamoushinderu",
    { algorithm: 'HS256', expiresIn: '1h' }
);
};



const createAgentToken = agent => {
  
  return jwt.sign(
    {
      sub: agent._id,
      email: agent.email,
      phoneNo:agent.phoneNo,
      role:agent.role,
      isAgent:agent.isAgent
    },
    "omaewamoushinderu",
    { algorithm: 'HS256', expiresIn: '1h' }
);
};

const hashPassword = password => {
  return new Promise((resolve, reject) => {
    // Generate a salt at level 12 strength
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};



const hashToken = token => {
  return new Promise((resolve, reject) => {
    // Generate a salt at level 12 strength
    bcrypt.genSalt(2, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(token, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};



const verifyPassword = (
  passwordAttempt,
  hashedPassword
) => {
  return bcrypt.compare(passwordAttempt, hashedPassword);
};


module.exports = {
  createToken,
  hashPassword,
  verifyPassword,
  createAgentToken,
  hashToken
};
