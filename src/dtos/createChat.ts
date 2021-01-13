import { IsString } from "class-validator";
import { IDTO } from "../interfaces/DTO";

class CreateChatDTO implements IDTO {

    @IsString()
    public receiverId: string;
}

export default CreateChatDTO;