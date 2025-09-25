import { IsString } from "class-validator";

export class UpdateTeacherDto {
    @IsString()
    name: string;
}

export class UpdateTeacherResponseDto{
    statusCode: number;
    message : string;
}