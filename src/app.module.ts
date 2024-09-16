// decorators
import { Module } from '@nestjs/common';

// modules
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './ormconfig';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { JwtModule } from '@nestjs/jwt';

// guards
import { AuthGuard } from './guards/auth.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env.development.local', '.env.production.local'],
            isGlobal: true,
        }),
        TypeOrmModule.forRoot(config),
        UserModule,
        AuthModule,
        JwtModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: 'APP_GUARD',
            useClass: AuthGuard, //All routes are by default private and need to be marked as public with Public Decorator
        },
    ],
})
export class AppModule {}
