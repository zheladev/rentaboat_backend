import { IsNumber, IsString } from "class-validator";

class PostRatingDTO {
    @IsNumber()
    public rating: number;

    @IsString()
    public comment: string;
}

export default PostRatingDTO;