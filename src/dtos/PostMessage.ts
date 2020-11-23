import { IsString } from "class-validator";

class PostMessageDTO {
    @IsString()
    public content: string;
}

export default PostMessageDTO;