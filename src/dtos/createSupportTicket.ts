import { IsString } from "class-validator";
import { IDTO } from "../interfaces/DTO";

class CreateSupportTicketDTO implements IDTO {

    @IsString()
    public supportTicketType: string;

    @IsString()
    public rental: string;

    @IsString()
    public subject: string;

    @IsString()
    public contentBody: string;

}

export default CreateSupportTicketDTO;