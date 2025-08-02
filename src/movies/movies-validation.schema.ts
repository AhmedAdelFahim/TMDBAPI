import Joi from 'joi';

const schema = {
  list: Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).default(10),
    q: Joi.string().trim().optional(),
    genres: Joi.array().items(Joi.string().trim()).min(1).optional(),
  }),
};

export default schema;
