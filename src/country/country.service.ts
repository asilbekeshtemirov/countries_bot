import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Country, CountryDocument } from './module';
import { Model } from 'mongoose';
import { CreateCountryDto } from './dtos';
import { UserRole } from 'src/user/enum';

@Injectable()
export class CountryService {
  constructor(
    @InjectModel(Country.name)
    private readonly countryModel: Model<CountryDocument>,
  ) {}

  async createCountry(payload: CreateCountryDto) {
    const foundedCountry = await this.countryModel.findOne({
      name: payload.name,
    });
    if (!foundedCountry) {
      throw new ConflictException('Country already exists!');
    }
    if (UserRole.ADMIN) {
      const country = new this.countryModel(payload);
      return await country.save();
    }
  }

  async findAll() {
    return await this.countryModel.find();
  }
}
