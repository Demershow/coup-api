
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { Prisma } from '@prisma/client';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) { }


  async create() {
    const maxRetries = 5;
    let attempt = 0;

    function generateRoomCode(length = 6): string {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let code = ''
      for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return code
    }


    while (attempt < maxRetries) {
      const code = generateRoomCode();

      try {
        return await this.prisma.room.create({
          data: { code },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          attempt++;
          continue; // tenta novo código
        }
        throw error;
      }
    }

    throw new ConflictException('Falha ao gerar código único para sala');
  }
}
