import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './ormconfig';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env.development.local', '.env.production.local'],
            isGlobal: true,
        }),
        TypeOrmModule.forFeature(config),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
