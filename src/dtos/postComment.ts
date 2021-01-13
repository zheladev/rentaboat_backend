import { IsString } from "class-validator";
import { IDTO } from "../interfaces/DTO";

class PostCommentDTO implements IDTO {
    @IsString()
    public comment: string;
}

export default PostCommentDTO;