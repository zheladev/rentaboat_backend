import { IsDate, IsString } from "class-validator";
import { IDTO } from "../interfaces/DTO";

class CreateRentalDTO implements IDTO {
    @IsDate()
    public startDate: Date;

    @IsString()
    public durationInDays: string;

    @IsString()
    public comment?: string;

    @IsString()
    public boatId: string;
}

export default CreateRentalDTO;