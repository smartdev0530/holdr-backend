import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

describe('AuthResolver (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  beforeEach(async () => {
    prisma = new PrismaClient();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('/graphql', () => {
    describe('login', () => {
      beforeEach(async () => {
        const salt = bcrypt.genSaltSync(10);

        const hash = bcrypt.hashSync('P@ssword1234', salt);

        const user = {
          role: 'general',
          username: 'xoxo_lover',
          digest: hash,
        };

        await prisma.user.create({
          data: user,
        });
      });

      it('should provide a user with a JWT string', async () => {
        const query = `
          mutation login($username: String!, $password: String!) {
            login(username: $username, password: $password)
          }`;

        const variables = {
          username: 'xoxo_lover',
          password: 'P@ssword1234',
        };

        const response = await request(app.getHttpServer())
          .post('/graphql')
          .send({ query, variables });

        expect(response.body.data.login).toBeDefined();
        expect(response.body.data.login.length).toBeGreaterThan(1);
      });
    });

    describe('register', () => {
      it('should create a new user and return a successful response', async () => {
        const query = `
          mutation register($payload: CreateUserInput!) {
            register(payload: $payload) {
              isSuccess
              message
              statusCode
              data {
                username
                role
              }
            }
          }`;

        const variables = {
          payload: {
            username: 'slim_jim',
            password: 'P@ssword12',
            role: 'general',
          },
        };

        const response = await request(app.getHttpServer())
          .post('/graphql')
          .send({ query, variables });

        expect(response.body.data.register).toBeDefined();
        expect(response.body.data.register.isSuccess).toBe(true);
        expect(response.body.data.register.statusCode).toBe(201);
        expect(response.body.data.register.data.username).toBe(
          variables.payload.username,
        );
        expect(response.body.data.register.data.role).toBe(
          variables.payload.role,
        );
      });
    });
  });
});
