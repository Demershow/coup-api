import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }


  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto)
  }

  @Get()
  findAll() {
    return this.userService.findAll()
  }
}
