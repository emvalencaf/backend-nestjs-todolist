// decorators
import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '../decorators/is_public.decorator';

// services
import { AuthService } from './auth.service';

// dtos
import { SignInUserDTO } from './dtos/sign-in-user.dto';
import { CreateUserDTO } from '../users/dtos/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post('/sign-in')
    async signIn(@Body() signIn: SignInUserDTO) {
        return this.authService.signIn(signIn);
    }

    @Public()
    @Post('/sign-up')
    async signUp(@Body() signUp: CreateUserDTO) {
        return this.authService.signUp(signUp);
    }
}
