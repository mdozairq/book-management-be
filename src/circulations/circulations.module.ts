import { Module } from '@nestjs/common';
import { CirculationsService } from './circulations.service';
import { CirculationsController } from './circulations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Circulations, CirculationsSchema } from './entities/circulation.entity';
import { Books, BooksSchema } from 'src/books/entities/book.entity';
import { Members, MembersSchema } from 'src/members/entities/member.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Circulations.name, schema: CirculationsSchema },
      { name: Books.name, schema: BooksSchema },
      { name: Members.name, schema: MembersSchema },
    ])
  ],
  controllers: [CirculationsController],
  providers: [CirculationsService],
})
export class CirculationsModule { }
