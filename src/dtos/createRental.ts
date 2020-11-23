import { IsDate, IsString } from "class-validator";

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