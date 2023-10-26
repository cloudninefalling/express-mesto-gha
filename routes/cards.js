const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createCard,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { linkRegex } = require('../constants/regex');

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string()
        .required()
        .min(2)
        .max(30),
      link: Joi.string()
        .required()
        .uri(),
    }),
  }),
  createCard,
);
router.get('/', getCards); // TODO: celeb
router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string()
        .alphanum()
        .length(24),
    }),
  }),
  deleteCardById,
);
router.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string()
        .alphanum()
        .length(24),
    }),
  }),
  likeCard,
);
router.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string()
        .alphanum()
        .length(24),
    }),
  }),
  dislikeCard,
);

module.exports = router;
