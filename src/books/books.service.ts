import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Books } from './entities/book.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpError } from 'src/errors/custom.errors';

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);
  constructor(
    @InjectModel(Books.name) public booksModel: Model<Books>,
  ) { }
  async findAllAvailableBooks(page: number = 0, page_size: number = 10) {
    let books;
    try {
      books = await this.booksModel.find({ is_active: true })
        .skip(page_size * page)
        .limit(page_size)
        .sort({ book_name: 1 })
        .lean()
    } catch (error) {
      this.logger.error(`error occurred while finding books for ${this.findAllAvailableBooks.name}`)
      throw HttpError(HttpStatus.INTERNAL_SERVER_ERROR, "something went wrong!")
    }

    return books;
  }

}
