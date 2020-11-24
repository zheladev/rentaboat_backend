import { IsString } from "class-validator";

class CreateSupportTicketDTO {

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