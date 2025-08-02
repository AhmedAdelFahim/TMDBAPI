import Joi from 'joi';

const schema = {
  addToWishlist: Joi.object({
    movie_id: Joi.number().min(1).required(),
  }),
  removeFromWishlist: Joi.object({
    movie_id: Joi.number().min(1).required(),
  }),
  list: Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).default(10),
    q: Joi.string().trim().optional(),
  }),
};

export default schema;
