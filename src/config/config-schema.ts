import Joi from 'joi';

export default () => {
  return Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test', 'provision')
      .default('development'),
    PORT: Joi.number().port().default(9000),
    DB_URL: Joi.string().trim().required(),
    REDIS_URL: Joi.string().trim().required(),
    TOKEN_SECRET: Joi.string().trim().required(),
    TMDB_API_KEY: Joi.string().trim().required(),
  });
};
