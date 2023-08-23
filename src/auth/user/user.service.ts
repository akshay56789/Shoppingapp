import {UserModel} from '@udemyshoppingapp/common'
import { User } from './user.model'
import { AuthDto } from '../dtos/auth.dto'
export class UserService {
    constructor(
        public userModel: UserModel
    ) {}

    async create(CreateUserDto: AuthDto) {
        const user = new this.userModel({
            email: CreateUserDto.email,
            password: CreateUserDto.password
        });

        return await user.save()

    }

    async findOneByEmail(email: string) {
        return await this.userModel.findOne({ email })
    }
}

export const userService = new UserService(User)