// decorators
import { Injectable, UnauthorizedException } from '@nestjs/common';

// services
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';

// entities
import { UserEntity } from '../users/entities/user.entity';

// dtos
import { SignInUserDTO } from './dtos/sign-in-user.dto';
import { CreateUserDTO } from '../users/dtos/create-user.dto';

// utils
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {}

    async signUp(signUp: CreateUserDTO) {
        return this.userService.create(signUp);
    }

    // Sign in as a user
    async signIn(signIn: SignInUserDTO) {
        const user = await this.validateUserPassword(signIn);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        console.log('user: ', user);
        console.log('JWT_SECRET env: ', process.env.JWT_SECRET);
        // Caso contrário, crie uma nova sessão
        const accessToken = await this.jwtService.signAsync({
            id: user.id,
        });

        return {
            accessToken,
        };
    }

    // Get token expiration date from JWT
    async getTokenExpiration(token: string): Promise<Date> {
        const decodedToken = this.jwtService.decode(token) as {
            exp: number;
        } | null;

        if (decodedToken && decodedToken.exp) {
            return new Date(decodedToken.exp * 1000);
        } else {
            throw new Error('Invalid token or missing expiration field');
        }
    }

    // Validate user credentials
    async validateUserPassword(
        signIn: SignInUserDTO,
    ): Promise<UserEntity | null> {
        const user = await this.userService.getByEmail({
            email: signIn.email,
            showPassword: true,
        });

        if (!user) throw new UnauthorizedException('Invalid email');

        const isMatch = await bcrypt.compare(signIn.password, user.password);

        return isMatch ? user : null;
    }
}
