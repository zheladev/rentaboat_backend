import { IsEmail, IsString } from "class-validator";

class RegisterDto {
    @IsString()
    public userType: number;

    @IsEmail()
    public email: string;

    @IsString()
    public username: string;
   
    @IsString()
    public firstName: string;

    @IsString()
    public lastName: string;

    @IsString()
    public address: string;

    @IsString()
    public password: string;
}

export default RegisterDto;