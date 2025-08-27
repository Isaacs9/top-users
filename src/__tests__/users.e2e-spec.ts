import { Test, TestingModule } from '@nestjs/testing';
import { INestMicroservice } from '@nestjs/common';
import { Transport, ClientProxyFactory, ClientProxy } from '@nestjs/microservices';
import { GenericContainer } from 'testcontainers';
import {knex, Knex} from 'knex';
import { AppModule } from '../app.module';
import {firstValueFrom, lastValueFrom} from "rxjs";
import {KnexModule} from "nestjs-knex";
import {TestAppModule} from "../test.module";

describe('Users Microservice (e2e) - Knex + Testcontainers', () => {
    let app: INestMicroservice;
    let client: ClientProxy;
    let db: Knex;
    let container;
    const email = `isaac+${Date.now()}@test.com`;

    beforeAll(async () => {
        process.env.NODE_ENV = 'test';
        container = await new GenericContainer('postgres')
            .withEnvironment({
                POSTGRES_USER: 'test',
                POSTGRES_PASSWORD: 'test',
                POSTGRES_DB: 'testdb',
            })
            .withExposedPorts(5432)
            .start();

        const mappedPort = container.getMappedPort(5432);
        console.log(`Postgres container started on port ${mappedPort}`);
        console.log(`Postgres container started on port ${container.getHost()}`);
        db = knex({
            client: 'pg',
            connection: {
                host: container.getHost(),
                port: mappedPort,
                user: 'test',
                password: 'test',
                database: 'testdb',
            },
            searchPath: ['users'],
            migrations: {
                directory: './src/infra/database/migrations',
                extension: 'ts',
            },
            seeds: {
                directory: './src/infra/database/seeds',
                extension: 'ts',
            }
        });

        await db.raw(`CREATE SCHEMA IF NOT EXISTS users;`);
        await db.migrate.latest();
        await db.seed.run();

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [TestAppModule.forRoot(db)],
        }).compile();

        app = moduleFixture.createNestMicroservice({
            transport: Transport.TCP,
            options: { host: '127.0.0.1', port: 8877 },
        });

        await app.listen();

        client = ClientProxyFactory.create({ transport: Transport.TCP, options: { host: '127.0.0.1', port: 8877 } });
        await client.connect();
    });

    afterAll(async () => {
        if (client) await client.close();
        if (app) await app.close();
        if (db) await db.destroy();
        if (container) await container.stop();
    });

    it('deve criar usuário', async () => {
        const userId= await lastValueFrom(client.send({cmd: 'users.create'}, {nome: 'Isaac', email: email, password: '123456'}))

        expect(userId).toBeDefined();
        const user = await db('users').where({email}).first();
        expect(user).toBeDefined();
        expect(user.email).toBe(email);
    });

    it('deve atualizar o usuário', async () => {
        const user = await db('users').where({email}).first();
        const data= await lastValueFrom(client.send({cmd: 'users.update'}, {id: user.id, patch: {
                nome: 'email'
            }}))

        expect(data).toBeDefined();
        expect(data.success).toBe(true);
    });


    it('deve listar usuários', async () => {
        const res = await client.send({ cmd: 'users.list' }, {}).toPromise();
        expect(Array.isArray(res)).toBe(true);
        expect(res.length).toBeGreaterThan(0);
    });

    it('deve buscar usuário por email', async () => {
        const res = await client.send({ cmd: 'users.findByEmail' }, { email: email }).toPromise();
        expect(res).toBeDefined();
        expect(res.email).toBe(email);
    });

    it('deve deletar o usuário', async () => {
        const user = await db('users').where({email}).first();
        const data= await lastValueFrom(client.send({cmd: 'users.remove'}, {id: user.id}))

        expect(data).toBeDefined();
        expect(data.success).toBe(true);
    });
});
