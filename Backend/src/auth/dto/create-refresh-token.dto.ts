import { IsString, IsNotEmpty } from "class-validator";

export class CreateRefreshTokenDto {
  @IsString({ message: 'Refresh token must be a string' })
  @IsNotEmpty({ message: 'Refresh token is required' })
  refreshToken: string;
}

export class CreateRefreshTokenResponseDto {
  message: string;
  accessToken: string;
  refreshToken: string;
  statusCode: number;
}
