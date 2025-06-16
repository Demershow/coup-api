import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomModule } from './room/room.module';
import { UserModule } from './user/user.module';
import { PlayerModule } from './player/player.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { GameService } from './game/game.service';
import { GameController } from './game/game.controller';
import { GameModule } from './game/game.module';
import { ActionModule } from './action/action.module';

@Module({
  imports: [RoomModule, UserModule, PlayerModule, PrismaModule, GameModule, ActionModule],
  controllers: [AppController, GameController],
  providers: [AppService, PrismaService, GameService],
  exports: [PrismaService]
})
export class AppModule { }
