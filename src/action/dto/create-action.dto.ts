import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ActionType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActionDto {
  @IsEnum(ActionType)
  type: ActionType;

  @IsString()
  playerId: string;

  @IsOptional()
  @IsString()
  targetId?: string;
}

