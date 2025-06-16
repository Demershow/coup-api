import { IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @ApiProperty({ example: 'joao123' })
  name: string;
}