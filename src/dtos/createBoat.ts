import { IsNumber, IsString } from "class-validator";
import { IDTO } from "../interfaces/DTO";


class CreateBoatDto implements IDTO {
    @IsString()
    public shipyard;

    @IsString()
    public name;

    @IsString()
    public boatType;

    @IsString()
    public port;

    @IsString()
    public description;

    @IsNumber()
    public pricePerDay;

    @IsNumber()
    public length;

    @IsString()
    public model;

    @IsNumber()
    public passengerCapacity;
    
    @IsNumber()
    public numberOfCabins;

    @IsNumber()
    public numberOfBathrooms;

    @IsString()
    public base64Data?;
}

export default CreateBoatDto;