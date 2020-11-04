import { IsString } from "class-validator";


class LoginDto {
    @IsString()
    public username;

    @IsString()
    public password;
}

export default LoginDto;