// src/player/dto/create-player.dto.ts
import { IsString, Length } from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  userId: string;

  @IsString()
  @Length(6, 6)
  roomCode: string;
}
