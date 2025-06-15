// src/game/game.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StartGameDto } from './dto/start-game.dto';
import { shuffle } from 'src/utils/shuffle';
import { CardType } from '@prisma/client';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) { }

  async startGame(dto: StartGameDto) {
    const room = await this.prisma.room.findUnique({
      where: { code: dto.roomCode },
      include: { players: { include: { user: true } } },
    });

    if (!room) throw new NotFoundException('Sala não encontrada');
    if (room.players.length < 2 || room.players.length > 6)
      throw new BadRequestException('Número de jogadores inválido');

    const allCards: CardType[] = [
      ...Array(6).fill(CardType.DUKE),
      ...Array(6).fill(CardType.ASSASSIN),
      ...Array(6).fill(CardType.CAPTAIN),
      ...Array(6).fill(CardType.CONTESSA),
      ...Array(6).fill(CardType.AMBASSADOR),
      ...Array(6).fill(CardType.INQUISITOR),
    ];

    const shuffledCards = shuffle(allCards);

    const game = await this.prisma.game.create({
      data: {
        roomId: room.id,
        currentTurn: 0,
      },
    });

    const cards = await Promise.all(
      shuffledCards.map((type) =>
        this.prisma.card.create({
          data: { type, gameId: game.id },
        })
      )
    );

    const order = shuffle(room.players);
    await Promise.all(
      order.map((player, index) =>
        this.prisma.turnOrder.create({
          data: {
            gameId: game.id,
            playerId: player.id,
            position: index,
          },
        })
      )
    );

    const hands = await Promise.all(
      order.flatMap((player) => {
        const handCards = cards.splice(0, 2);
        return handCards.map((card) =>
          this.prisma.hand.create({
            data: {
              playerId: player.id,
              cardId: card.id,
            },
          })
        );
      })
    );

    const handsWithCards = await this.prisma.hand.findMany({
      where: {
        playerId: { in: order.map(p => p.id) },
      },
      include: {
        card: true,
        player: {
          include: { user: true },
        },
      },
    });


    return {
      gameId: game.id,
      turnOrder: order.map((p) => ({
        id: p.id,
        userId: p.userId,
        userName: p.user.name,
      })),
      hands: handsWithCards.map((hand) => ({
        playerId: hand.playerId,
        userName: hand.player.user.name,
        cardId: hand.cardId,
        cardType: hand.card.type,
      })),
      cardsPerPlayer: 2,
      totalCardsLeft: cards.length,
    };

  }
}
