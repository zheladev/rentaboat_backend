import { IsString } from "class-validator";

class CreateChatDTO {

    @IsString()
    public receiverId: string;
}

export default CreateChatDTO;