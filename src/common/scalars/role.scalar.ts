import { GraphQLScalarType } from 'graphql/type';
import { RoleArr } from '../constants';
import { Role } from '../types';

function validate(role: Role): string | never {
  if (typeof role !== 'string' || !RoleArr.includes(role)) {
    throw new Error('invalid scope');
  }
  return role;
}

export const RoleScalar = new GraphQLScalarType({
  name: 'Role',
  description: `The user role. Accepts the following values: ${RoleArr.map(
    (role) => `"${role}"`,
  ).join(', ')}`,
  serialize: (value) => validate(value as Role),
  parseValue: (value) => validate(value as Role),
  parseLiteral: (ast) => validate(ast['value']),
});
