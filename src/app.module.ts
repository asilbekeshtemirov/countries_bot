import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

// User va Country modullari (har biri o'z ichida controller va service ni o'z ichiga oladi)
import { UserModule } from './user/user.module';
import { CountryModule } from './country/country.module';

// Bot module (agar botni alohida modul qilgan bo'lsangiz, shuni qo'shing)
import { BotModule } from './bot/bot.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URL || 'mongodb://localhost:27017/az'), // .env dan yoki default
    UserModule,
    CountryModule,
    BotModule, // bot logikasi shu yerda bo'ladi
  ],
  // Controllers odatda modul ichida bo'ladi, AppModule da shunchaki import qilamiz
  // Controllers bu yerda kiritish shart emas, chunki UserModule va CountryModule o'z controllerlarini o'zida import qiladi
})
export class AppModule {}
