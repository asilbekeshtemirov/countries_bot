import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CountryService } from "./country.service";
import { CreateCountryDto } from "./dtos";

@ApiTags('Country')
@Controller("country")
export class CountryController {
    constructor(private readonly countryService: CountryService) {}

    @Post()
    async createCountry(@Body() payload: CreateCountryDto) {
        return await this.countryService.createCountry(payload);
    };

    @Get()
    async getAll() {
        return await this.countryService.findAll();
    }
}