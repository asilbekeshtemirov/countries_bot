import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user/user.service';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UserModule,
        MongooseModule.forRoot('mongodb://localhost:27017/az'),

  ],

  // providers: [UserService] ,
})
export class AppModule {}
