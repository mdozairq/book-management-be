import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Configs } from './config/config';
import { MongooseModule } from '@nestjs/mongoose';
import { jwtFactory } from './jwt/auth.jwt';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './role/role-guard';
import { BooksModule } from './books/books.module';
import { MembersModule } from './members/members.module';
import { CirculationsModule } from './circulations/circulations.module';

@Module({
  imports: [
    MongooseModule.forRoot(Configs().databases.mongo_db.uri),
    JwtModule.registerAsync(jwtFactory),
    BooksModule,
    MembersModule,
    CirculationsModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }],
})
export class AppModule { }
