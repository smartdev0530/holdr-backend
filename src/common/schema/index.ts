import * as Joi from 'joi';

export const EnvSchema = Joi.object({
  NEST_ENVIRONMENT: Joi.string()
    .valid('development', 'production', 'staging', 'test')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_TTL: Joi.number().default(60).required(),
});
