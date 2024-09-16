// libs
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../decorators/is_public.decorator';
import { Reflector } from '@nestjs/core';

// services
import { JwtService } from '@nestjs/jwt';

// dtos

// types
import { Request } from 'express';
import { SignInPayloadDTO } from '../auth/dtos/sign-in.payload.dto';

// utils

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (isPublic) return true;

        const request = context.switchToHttp().getRequest();

        const accessToken = this.extractTokenFromHeader(request);

        if (!accessToken) throw new UnauthorizedException('Token not found');

        try {
            const payload: SignInPayloadDTO = await this.jwtService.verifyAsync(
                accessToken,
                {
                    secret: process.env.JWT_SECRET || 'default_secret',
                },
            );

            if (!payload) {
                throw new UnauthorizedException('Invalid token payload');
            }

            return true;
        } catch (err) {
            console.log(err);
            throw new UnauthorizedException('Invalid or expired token');
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const authHeader = request.headers.authorization;
        if (!authHeader) return undefined;

        const [type, token] = authHeader.split(' ');
        return type === 'Bearer' ? token : undefined;
    }
}
