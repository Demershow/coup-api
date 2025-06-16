import { Body, Controller, Param, Post } from '@nestjs/common';
import { ActionService } from './action.service';
import { CreateActionDto } from './dto/create-action.dto';
import { RespondActionDto } from './dto/respond-action.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('actions')

@Controller('games/:gameId/actions')
export class ActionController {
  constructor(private actionService: ActionService) { }

  @Post()
  create(
    @Param('gameId') gameId: string,
    @Body() dto: CreateActionDto
  ) {
    return this.actionService.create(gameId, dto);
  }

  @Post(':actionId/respond')
  respond(
    @Param('actionId') actionId: string,
    @Body() dto: RespondActionDto
  ) {
    return this.actionService.respond(actionId, dto);
  }

}
