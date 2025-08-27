import {DynamicModule, Module} from '@nestjs/common';
import {UsersModule} from './modules/users/users.module';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {KnexModule} from "nestjs-knex";
import {classes} from "@automapper/classes";
import {AutomapperModule} from "@automapper/nestjs";
import {knex} from "knex";

@Module({
    imports: [ConfigModule.forRoot({isGlobal: true}),
        KnexModule.forRootAsync({
        inject: [ConfigService], useFactory: (config: ConfigService) => ({
            config: {
                client: config.get<string>('DB_CLIENT'), connection: {
                    host: config.get<string>('DB_HOST'),
                    port: config.get<number>('DB_PORT'),
                    user: config.get<string>('DB_USER'),
                    password: config.get<string>('DB_PASSWORD'),
                    database: config.get<string>('DB_NAME'),
                },
                searchPath: [config.get<string>('DB_SCHEMA')]
            },
        }),
    }), AutomapperModule.forRoot({
        strategyInitializer: classes(),
    }), UsersModule],
})
export class AppModule {
    static registerForTest(testDb: knex.Knex): DynamicModule {
        return {
            module: AppModule,
            imports: [
                KnexModule.forRoot({
                    config: testDb.client.config,
                }),
                AutomapperModule.forRoot({ strategyInitializer: classes() }),
                UsersModule,
            ],
        };
    }
}
