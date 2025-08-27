"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const microservices_1 = require("@nestjs/microservices");
const app_module_1 = require("../../app.module");
const knexfile_test_1 = require("../../knexfile.test");
const knex_1 = require("knex");
describe('Users microservice (e2e)', () => {
    let app;
    let client;
    const db = (0, knex_1.default)(knexfile_test_1.default);
    beforeAll(async () => {
        await db.migrate.latest();
        await db.seed.run();
        const moduleRef = await testing_1.Test.createTestingModule({ imports: [app_module_1.AppModule] }).compile();
        app = moduleRef.createNestMicroservice({
            transport: microservices_1.Transport.TCP,
            options: { port: 0 }
        });
        await app.listenAsync();
        const addr = app.server.address();
        const port = addr && addr.port ? addr.port : Number(process.env.TCP_PORT || 4001);
        client = microservices_1.ClientProxyFactory.create({ transport: microservices_1.Transport.TCP, options: { host: '127.0.0.1', port } });
        await client.connect();
    });
    afterAll(async () => {
        await client.close();
        await app.close();
        await db.destroy();
    });
    it('findByEmail returns admin', async () => {
        const res = await client.send({ cmd: 'users.findByEmail' }, { email: 'admin@example.com' }).toPromise();
        expect(res).toBeDefined();
        expect(res.email).toBe('admin@example.com');
    });
    it('list returns array', async () => {
        const list = await client.send({ cmd: 'users.list' }, {}).toPromise();
        expect(Array.isArray(list)).toBe(true);
        expect(list.length).toBeGreaterThan(0);
    });
});
