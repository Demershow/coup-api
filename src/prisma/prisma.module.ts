import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Torna acessível globalmente (opcional)
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule { }
