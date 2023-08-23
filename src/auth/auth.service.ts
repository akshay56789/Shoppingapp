import { NextFunction } from "express";
import { AuthDto } from "./dtos/auth.dto";
import { UserService, userService } from "./user/user.service";
import {AuthenticationService, BadRequestError} from "@udemyshoppingapp/common"

export class AuthService {
    constructor(
        public userService: UserService,
        public authenticationService: AuthenticationService
    ) {}

    async signup(CreateUserDto: AuthDto, errCallback: NextFunction) {
        const existingUser = await this.userService.findOneByEmail(CreateUserDto.email)
        if(existingUser){
            return {message: "Email is taken"}
        }
        const newUser = await this.userService.create(CreateUserDto)
        
        
        const jwt = this.authenticationService.generateJwt({email: CreateUserDto.email, userId: newUser.id}, process.env.JWT_KEY!)
        return {jwt};
    }

    async signin(signinDto: AuthDto, errCallback: NextFunction){
        const user = await this.userService.findOneByEmail(signinDto.email);
        if(!user) return {message: "Wrong credentials"};

        const samePwd = this.authenticationService.pwdCompare(user.password, signinDto.password)

        if(!samePwd) return { message: "Wrong credentials"}
        const jwt = this.authenticationService.generateJwt({email: user.email, userId: user.id}, process.env.JWT_KEY!)
        return {jwt}
    }
}

export const authService = new AuthService(userService, new AuthenticationService())