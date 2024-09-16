import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config({
    path: '.development.env',
});

const config: TypeOrmModuleOptions & DataSourceOptions = {
    type: 'mongodb',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [`${__dirname}/**/*.entity{.js,.ts}`],
    migrations: [`${__dirname}/migrations/**/*{.ts,.js}`],
    synchronize: false, // Deve ser false em produção
    migrationsRun: false, // Executa as migrations automaticamente na inicialização
};

export default config;

// create the datasource for CLI TypeORM

export const AppDataSource = new DataSource(config);
