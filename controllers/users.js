const User = require('../models/user');
const { Status } = require('../constants');

// prettier-ignore
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => {
      res.status(Status.SERVER_ERROR).send({ message: 'Server-side error' });
    });
};

// prettier-ignore
module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(Status.NOT_FOUND).send({ message: 'User not found' });
      } else {
        res.send({
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(Status.BAD_REQUEST).send({ message: 'Invalid ID' });
      } else res.status(Status.SERVER_ERROR).send({ message: 'Server-side error' });
    });
};

// prettier-ignore
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(Status.BAD_REQUEST).send({ message: 'Incorrect request body. Body must contain: name, about, avatar' });
      } else res.status(Status.SERVER_ERROR).send({ message: 'Server-side error' });
    });
};

// prettier-ignore
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => {
      if (!user) {
        res.status(Status.NOT_FOUND).send({ message: 'User not found' });
      } else {
        res.send({
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(Status.BAD_REQUEST).send({ message: 'Invalid ID' });
      } else if (err.name === 'ValidationError') {
        res.status(Status.BAD_REQUEST).send({ message: 'Incorrect request body. Body must contain: name, about, avatar' });
      } else res.status(Status.SERVER_ERROR).send({ message: err });
    });
};

// prettier-ignore
module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      if (!user) {
        res.status(Status.NOT_FOUND).send({ message: 'User not found' });
      } else {
        res.send({
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(Status.BAD_REQUEST).send({ message: 'Invalid ID' });
      } else if (err.name === 'ValidationError') {
        res.status(Status.BAD_REQUEST).send({ message: 'Incorrect request body. Body must contain: name, about, avatar' });
      } else res.status(Status.SERVER_ERROR).send({ message: 'Server-side error' });
    });
};
