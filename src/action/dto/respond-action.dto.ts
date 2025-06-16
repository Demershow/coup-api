import { ApiProperty } from '@nestjs/swagger';

export class RespondActionDto {
  @ApiProperty({ enum: ['BLOCK', 'CHALLENGE', 'ACCEPT'] })
  response: 'BLOCK' | 'CHALLENGE' | 'ACCEPT';

  @ApiProperty({ description: 'ID do jogador que está respondendo' })
  playerId: string;
}
