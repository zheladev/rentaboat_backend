import { IsString } from "class-validator";

class CreateShipyardDTO {
    @IsString()
    public name: string;
}

export default CreateShipyardDTO;