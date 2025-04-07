import { IsNotEmpty, IsString } from "class-validator";

export class CreateMusicDto {
    @IsNotEmpty()
    @IsString()
    title: string;


}
