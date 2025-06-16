// src/player/dto/create-player.dto.ts
import { IsString, Length } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreatePlayerDto {
  @IsString()
  @ApiProperty({ example: 'user-id-123' })
  userId: string;

  @IsString()
  @Length(6, 6)
  @ApiProperty({ example: 'ABC123' })
  roomCode: string;
}
