import { Body, Controller, Post } from '@nestjs/common';
import { GameService } from './game.service';
import { StartGameDto } from './dto/start-game.dto';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) { }

  @Post('start')
  startGame(@Body() dto: StartGameDto) {
    return this.gameService.startGame(dto);
  }
}
