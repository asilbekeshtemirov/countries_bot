import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotUpdate } from './bot.update';
import { UserModule } from '../modules/user/user.module';
import { CountryModule } from '../modules/country/country.module';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: process.env.BOT_TOKEN,
    }),
    UserModule,
    CountryModule,
  ],
  providers: [BotUpdate],
})
export class BotModule {}export class BotModule {}
