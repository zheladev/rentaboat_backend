import { IsString } from "class-validator";
import { IDTO } from "../interfaces/DTO";

class PostMessageDTO implements IDTO {
    @IsString()
    public content: string;
}

export default PostMessageDTO;