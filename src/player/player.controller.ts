import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) { }

  @Post('join')
  create(@Body() dto: CreatePlayerDto) {
    return this.playerService.joinRoom(dto.userId, dto.roomCode);
  }

  @Get()
  findByRoom(@Query('roomCode') code: string) {
    return this.playerService.findByRoomCode(code);
  }
}
