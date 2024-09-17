import { createParamDecorator } from '@nestjs/common';

import { ExecutionContext } from '@nestjs/common';
import { SignInPayloadDTO } from '../auth/dtos/sign-in.payload.dto';
import { authorizationToSignInPayload } from '../utils/base-64-convert.util';

export const UserId = createParamDecorator((_, ctx: ExecutionContext) => {
    let { authorization } = ctx.switchToHttp().getRequest().headers;
    // get an access token
    authorization = authorization.includes('Bearer')
        ? authorization.split(' ')[1]
        : authorization;

    const signInPayload: SignInPayloadDTO | undefined =
        authorizationToSignInPayload(authorization);
    return signInPayload.id;
});
