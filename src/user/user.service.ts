import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './module/db';
import { UserRole } from './enum/enum.role';
import { CreateUserDto } from './dto/create.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(data: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel({
      ...data,
      role: data.role || UserRole.USER,
    });
    return createdUser.save();
  }

  async findByTelegramId(telegramId: number): Promise<User | undefined | null> {
    return this.userModel.findOne({ telegramId }).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, data, {
      new: true,
    }).exec();
    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  // Mana shu metodni qo‘shamiz:
  async updateByTelegramId(telegramId: number, data: Partial<UpdateUserDto>): Promise<User> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { telegramId },
      data,
      { new: true }
    ).exec();

    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  async remove(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) throw new NotFoundException('User not found');
    return deletedUser;
  }
}
