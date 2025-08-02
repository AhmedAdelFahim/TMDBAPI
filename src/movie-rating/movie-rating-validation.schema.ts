import Joi from 'joi';

const schema = {
  rateMovie: Joi.object({
    movie_id: Joi.number().min(1).required(),
    rating: Joi.number().min(1).max(5).required(),
  }),
};

export default schema;
