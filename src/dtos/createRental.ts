import { IsDate, IsNumber, IsString } from "class-validator";
import { create } from "ts-node";

class CreateRentalDTO {
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