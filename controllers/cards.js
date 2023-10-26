const Card = require('../models/card');
const { StatusCodes: Status } = require('../errors/StatusCodes');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

// prettier-ignore
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else next(err);
    });
};

// prettier-ignore
module.exports.getCards = (req, res, next) => {
  Card.find({}).populate('owner')
    .then((cards) => res.send({ cards }))
    .catch(next);
};

// prettier-ignore
module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card not found');
      } else if (!card.owner._id.equals(req.user._id)) {
        throw new ForbiddenError('UserID does not match card owner');
      } else {
        card.deleteOne()
          .then(res.send(card));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Card not found'));
      } else next(err);
    });
};

// prettier-ignore
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card not found');
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Card not found'));
      } else next(err);
    });
};

// prettier-ignore
module.exports.dislikeCard = (req, res, next) => {
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
        next(new NotFoundError('Card not found'));
      } else next(err);
    });
};
