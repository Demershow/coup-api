import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartGameDto {
  @IsString()
  @Length(6, 6)
  @ApiProperty({ example: 'ABC123' })
  roomCode: string;
}
