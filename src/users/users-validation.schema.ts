import Joi from 'joi';

const schema = {
  signup: Joi.object({
    email: Joi.string().trim().required().email(),
    name: Joi.string().trim().required(),
    password: Joi.string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      )
      .trim()
      .required()
      .messages({
        'string.pattern.base':
          'password must contain number, lower and upper case letters and special chars',
      }),
  }),
  login: Joi.object({
    email: Joi.string().trim().required().email(),
    password: Joi.string().trim().required(),
  }),
};

export default schema;
