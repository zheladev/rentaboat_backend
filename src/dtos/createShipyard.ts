import { IsString } from "class-validator";
import { IDTO } from "../interfaces/DTO";

class CreateShipyardDTO implements IDTO {
    @IsString()
    public name: string;
}

export default CreateShipyardDTO;