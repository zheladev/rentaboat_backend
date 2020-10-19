import { IsEmail, IsString } from "class-validator";

class CreateUserDto {
    @IsString()
    public name: string;

    @IsEmail()
    public email: string;
   
    @IsString()
    public firstName: string;

    @IsString()
    public lastName: string;

    @IsString()
    public address: string;

    @IsString()
    public password: string;
}

export default CreateUserDto;