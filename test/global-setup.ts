import { execSync } from 'child_process';

module.exports = async () => {
  execSync('yarn db:test:reset');
};
