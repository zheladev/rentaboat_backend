import { IsArray, IsString } from "class-validator";

class CreatePortDTO {

    @IsString()
    public name: string;

    @IsArray()
    public coordiantes: number[];
}

export default CreatePortDTO;