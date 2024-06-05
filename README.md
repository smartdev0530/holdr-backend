# Wave Members


## Technologies

- Nest JS
- GraphQL
- PostgreSQL
- Prisma
- JWTs
- Passport 
- TypeScript
- ESLint
- Prettier
- Solidity
- Hardhat

## Requirements

- Node 18 LTS/Hydrogen (LTS is recommended)
- Yarn 1+ (1.22.19 is recommended)
- PostgreSQL 16 (LTS is recommended)
- Dotenv (global installation - for E2E tests)

## Setup

1. Initialize your DB.

2. Create an `.env` file and add variables.

3. Install all the packages
    ```
    yarn
    ```
4. Ensure that you have an active DB, and run a migration
    ```
    yarn db:dev:migrate
    ```
5. Start the application
    ```
    yarn start:dev
    ```
## Migrations

After updating the `prisma/schema.prisma` file with the new models, you
can run the `yarn db:test:migrate` command to test the current state of
your DB. If you are satisfied with the state, you can then run `yarn db:dev:migrate`
to run schema migrations.

You can learn more [here](https://www.prisma.io/docs/orm/prisma-migrate/getting-started).

## Scripts

`yarn start:dev`

Runs the application in development environment.

`yarn build`

Builds a production-ready application and stores it into the `dist/`.

`yarn test`

Runs all test files.

`yarn test:cov`

Run tests and show code coverage of the tests.

`yarn test:e2e`

Run end-to-end tests.

`yarn db:dev:migrate`

Sync database with your prisma schema.

`yarn db:test:migrate`

Push schema changes to the database, but not track the changes as migrations.

`yarn db:studio`

Open up a visual editor for the database.

`yarn db:generate`

Generate Prisma client using the prisma schema.

`contracts:compile`

Compile smart contract.

`contracts:start:node`

Start a local Hardhat Eth node 

`contracts:deploy`

Deploy smart contract

# Contributors

- [Tak](https://github.com/takumhonde9)