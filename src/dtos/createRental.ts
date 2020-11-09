import { IsDate, IsNumber, IsString } from "class-validator";
import { create } from "ts-node";

class CreateRentalDTO {
    @IsDate()
    public startDate: Date;

    @IsNumber()
    public durationInDays: number;

    @IsString()
    public comment?: string;

    @IsString()
    public boatId: string;
}

export default CreateRentalDTO;