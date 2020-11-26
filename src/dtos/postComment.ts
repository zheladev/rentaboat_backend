import { IsString } from "class-validator";

class PostCommentDTO {
    @IsString()
    public comment: string;
}

export default PostCommentDTO;