import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateActionDto } from './dto/create-action.dto';
import { RespondActionDto } from './dto/respond-action.dto';
import { ActionStatus } from '@prisma/client';

@Injectable()
export class ActionService {
  constructor(private prisma: PrismaService) { }

  async create(gameId: string, dto: CreateActionDto) {
    const game = await this.prisma.game.findUnique({ where: { id: gameId } });
    if (!game) throw new NotFoundException('Jogo não encontrado');

    const player = await this.prisma.player.findUnique({ where: { id: dto.playerId } });
    if (!player) throw new NotFoundException('Jogador não encontrado');

    const target = dto.targetId
      ? await this.prisma.player.findUnique({ where: { id: dto.targetId } })
      : null;

    if (dto.targetId && !target) throw new BadRequestException('Alvo inválido');

    // Verifica se é o jogador da vez
    const turn = await this.prisma.turnOrder.findFirst({
      where: {
        gameId,
        position: game.currentTurn,
      },
    });



    if (!turn || turn.playerId !== dto.playerId) {
      throw new BadRequestException('Não é a sua vez');
    }

    const action = await this.prisma.action.create({
      data: {
        type: dto.type,
        gameId,
        playerId: dto.playerId,
        targetId: dto.targetId,
        status: ActionStatus.PENDING,
      },
    });

    return action;
  }

  async respond(actionId: string, dto: RespondActionDto) {
    const action = await this.prisma.action.findUnique({ where: { id: actionId } });
    if (!action) throw new NotFoundException('Ação não encontrada');

    // Verificar se já foi respondida
    if (action.status !== 'PENDING') {
      throw new BadRequestException('Ação já foi resolvida');
    }

    // Aqui vamos guardar a resposta e deixar pendente o julgamento
    return this.prisma.action.update({
      where: { id: actionId },
      data: {
        response: dto.response,
        respondedById: dto.playerId, // precisa ter esse campo no model se quiser registrar quem respondeu
        status: 'RESOLVED', // ou manter 'PENDING' se for processar depois
      },
    });
  }

}
