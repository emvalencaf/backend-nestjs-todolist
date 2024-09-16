import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './dtos/create-user.dto';
import { GetUserByEmailDTO } from './dtos/get-user-by-email.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async getByEmail(getUserByEmailDto: GetUserByEmailDTO) {
        const user = await this.userRepository.findOne({
            where: {
                email: getUserByEmailDto.email,
            },
        });

        // Exclui o campo password
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        if (!getUserByEmailDto.showPassword) delete user.password;

        return user;
    }

    async create(createUser: CreateUserDTO) {
        const { email, password, ...otherFields } = createUser;

        // Verifica se o e-mail já está em uso
        const existingUser = await this.userRepository.findOne({
            where: { email },
        });
        if (existingUser) {
            throw new BadRequestException('Email already in use');
        }

        // Criptografar a senha
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Cria a entidade do usuário com a senha criptografada
        const newUser = this.userRepository.create({
            ...otherFields,
            email,
            password: hashedPassword,
        });

        console.log(newUser);
        // Salva o usuário no banco de dados
        return this.userRepository.save(newUser);
    }
}
