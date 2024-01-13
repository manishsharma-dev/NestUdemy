import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        //fake copy of users service
        fakeUsersService = {
            find: () => Promise.resolve([]),
            create: (email: string, password: string) => Promise.resolve(
                {
                    id: 1,
                    email,
                    password
                } as User
            )
        }
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile();
        service = module.get(AuthService);
    });
    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    })

    it('can create a new user with a salted and hashed password', async () => {
        const user = await service.signup('asdf@asdf.com', 'asdf');

        expect(user.password).not.toEqual('asdf');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    })

    it('throws an error if user signs up with email that is in use', async () => {
        fakeUsersService.find = () => Promise.resolve([{ id: 1, email: 'a', password: '1' } as User])
        await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
            BadRequestException,
        );
    })

    it('throws if signin is called with an unused email', async () => {
        await expect(
            service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
        ).rejects.toThrow(NotFoundException);
    });

    it('throws if an invalid password is provided', async () => {
        fakeUsersService.find = () =>
            Promise.resolve([
                { email: 'hr@taskly.com', password: 'hr123' } as User,
            ]);
        await expect(
            service.signin('hr@taskly.com', 'hr123'),
        ).rejects.toThrow(BadRequestException);
    });

    it('return a user if a correct user is provided', async () => {
        fakeUsersService.find = () =>
            Promise.resolve([
                { email: 'hr@taskly.com', password: '1f57d5edf19b7c12.4f1640aef48b8572e79a474d02631f1546f528debfc0ea2ccae9fe2f00e9fc63' } as User,
            ]);

        const user = service.signin('hr@taskly.com', 'hr123');
        expect(user).toBeDefined();
        
    })

})
