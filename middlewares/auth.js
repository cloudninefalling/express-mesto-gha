/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const { StatusCodes: Status } = require('../errors/StatusCodes');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(Status.UNAUTHORIZED)
      .send({ message: 'Authorization required' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    return res
      .status(Status.UNAUTHORIZED)
      .send({ message: 'Authorization required' });
  }

  req.user = payload;

  next();
};
