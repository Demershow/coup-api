import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlayerDto } from './dto/create-player.dto';

@Injectable()
export class PlayerService {
  constructor(private prisma: PrismaService) { }

  async joinRoom(userId: string, roomCode: string) {
    const room = await this.prisma.room.findUnique({
      where: { code: roomCode },
    });

    if (!room) throw new NotFoundException('Sala não encontrada');

    const existingPlayer = await this.prisma.player.findFirst({
      where: {
        userId,
        roomId: room.id,
      },
    });

    if (existingPlayer) {
      throw new ConflictException('Usuário já está na sala');
    }

    const player = await this.prisma.player.create({
      data: {
        userId,
        roomId: room.id,
      },
      include: {
        user: true, // Se quiser retornar com os dados do usuário
      },
    });

    return player;
  }


  async findByRoomCode(code: string) {
    const room = await this.prisma.room.findUnique({
      where: { code },
      include: {
        players: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!room) throw new NotFoundException('Room not found');

    return room.players;
  }
}
