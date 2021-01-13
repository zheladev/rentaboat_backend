import { IsArray, IsString } from "class-validator";
import { IDTO } from "../interfaces/DTO";

class CreatePortDTO implements IDTO {

    @IsString()
    public name: string;

    @IsArray()
    public coordiantes: number[];
}

export default CreatePortDTO;