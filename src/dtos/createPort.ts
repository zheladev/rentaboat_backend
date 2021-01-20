import { IsArray, IsObject, IsString } from "class-validator";
import { IDTO } from "../interfaces/DTO";

class CreatePortDTO implements IDTO {

    @IsString()
    public name: string;

    @IsObject()
    public coordiantes: Object;
}

export default CreatePortDTO;