import { IsEmail, IsString } from "class-validator";
import { IDTO } from "../interfaces/DTO";

class RegisterDto implements IDTO {
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

    @IsString()
    public base64Data?;
}

export default RegisterDto;