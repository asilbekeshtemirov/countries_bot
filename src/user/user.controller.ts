import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import {  ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @ApiOperation({
    summary: 'Create a new user',
    description: 'Create a new user with the given data',
  })
  @Post()
  create(@Body()body:CreateUserDto ) {
    return this.userService.create(body);
  }

  @ApiOperation({
    summary: "Find all users",
    description: "Returns all users in the database",
  })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    body:UpdateUserDto,
  ) {
    return this.userService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
