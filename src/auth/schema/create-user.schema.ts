import * as Joi from 'joi';
import { ICreateUser } from '../types';
import { roleArr } from '../../common';

export const CreateUserSchema = Joi.object<ICreateUser>({
  username: Joi.string()
    .min(1)
    .pattern(/^[a-zA-Z0-9_]*$/)
    .required(),

  // [🔧] Add your code

  // extend this by adding a pattern:
  //  - alphanumeric
  //  - at least 1 char
  //  - at least 1 number
  //  - at least 1 special character
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])')) // add pattern for joi
    .required(),

  role: Joi.string()
    .valid(...roleArr)
    .required(),
});
