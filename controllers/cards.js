const Card = require('../models/card');
const { Status } = require('../constants');

// prettier-ignore
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(Status.BAD_REQUEST).send({ message: 'Incorrect request body. Body must contain: name, link' });
      } else res.status(Status.SERVER_ERROR).send({ message: 'Server-side error' });
    });
};

// prettier-ignore
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(() => res.status(Status.SERVER_ERROR).send({ message: 'Server-side error' }));
};

// prettier-ignore
module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(Status.NOT_FOUND).send({ message: 'Card not found' });
      } else {
        res.send({
          _id: card._id,
          name: card.name,
          link: card.link,
          owner: card.owner,
          likes: card.likes,
          createdAt: card.createdAt,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(Status.BAD_REQUEST).send({ message: 'Invalid ID' });
      } else res.status(Status.SERVER_ERROR).send({ message: 'server-side error' });
    });
};

// prettier-ignore
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(Status.NOT_FOUND).send({ message: 'Card not found' });
      } else {
        res.send({
          _id: card._id,
          name: card.name,
          link: card.link,
          owner: card.owner,
          likes: card.likes,
          createdAt: card.createdAt,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(Status.BAD_REQUEST).send({ message: 'Invalid ID' });
      } else res.status(Status.SERVER_ERROR).send({ message: 'server-side error' });
    });
};

// prettier-ignore
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(Status.NOT_FOUND).send({ message: 'Card not found' });
      } else {
        res.send({
          _id: card._id,
          name: card.name,
          link: card.link,
          owner: card.owner,
          likes: card.likes,
          createdAt: card.createdAt,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(Status.BAD_REQUEST).send({ message: 'Invalid ID' });
      } else res.status(Status.SERVER_ERROR).send({ message: err });
    });
};
