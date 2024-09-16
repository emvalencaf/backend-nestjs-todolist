// decorators
import { Module } from '@nestjs/common';

// modules
import { UserModule } from '../users/user.module';
import { JwtModule } from '@nestjs/jwt';

// controllers

import { AuthController } from './auth.controller';
// services
import { AuthService } from './auth.service';
@Module({
    imports: [
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: process.env.JWT_SECRET || 'default_secret',
                signOptions: {
                    expiresIn: process.env.JWT_EXPIRES_IN || '3600S',
                },
            }),
        }),
        UserModule,
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
