import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async signup(email: string, password: string) {
        const users = await this.usersService.find(email);
        if (users?.length) {
            throw new BadRequestException('Email in use');
        }

        const salt = randomBytes(8).toString('hex');   //generate salt

        const hash = (await scrypt(password, salt, 32)) as Buffer;  // hash the salt and the password together

        const result = salt + '.' + hash.toString('hex');  //Join the salt and the hash together

        const user = this.usersService.create(email, result);
        return user;

    }

    async signin(email: string, password: string) {
        const [user] = await this.usersService.find(email);
        if (!user) {
            throw new NotFoundException('Email not found');
        }

        const [salt, storedHash] = user.password.split('.');
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('bad password');

        }
        return user;
    }
}
