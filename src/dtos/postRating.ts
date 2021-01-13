import { IsNumber, IsString } from "class-validator";
import { IDTO } from "../interfaces/DTO";

class PostRatingDTO implements IDTO {
    @IsNumber()
    public rating: number;

    @IsString()
    public comment: string;
}

export default PostRatingDTO;