import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateCirculationDto, EventType } from './dto/create-circulation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Circulations } from './entities/circulation.entity';
import { Model } from 'mongoose';
import { Books } from 'src/books/entities/book.entity';
import { Members } from 'src/members/entities/member.entity';
import { HttpError } from 'src/errors/custom.errors';
import * as moment from "moment";

@Injectable()
export class CirculationsService {
  private readonly logger = new Logger(CirculationsService.name);
  constructor(
    @InjectModel(Circulations.name) public circulationsModel: Model<Circulations>,
    @InjectModel(Books.name) public booksModel: Model<Books>,
    @InjectModel(Members.name) public membersModel: Model<Members>,
  ) { }
  async checkoutCirculationOrder(createCirculationDto: CreateCirculationDto) {
    let book = await this.validateCheckoutCirculationOrder(createCirculationDto)
    let circulation, circulationCollectionPayload;
    console.log(createCirculationDto, book);

    try {
      circulationCollectionPayload = {
        member_id: createCirculationDto.member_id.toString(),
        book_id: createCirculationDto.book_id.toString(),
        due_date: moment(new Date(createCirculationDto.date)).add(7, 'd')
      }
    } catch (error) {
      console.log(error);

    }

    try {
      await this.booksModel.updateOne({ _id: createCirculationDto.book_id.toString() }, { $set: { number_of_copies: --book.number_of_copies } })
    } catch (error) {
      this.logger.error(`error occurred while creating criculation details for ${this.validateCheckoutCirculationOrder.name}`)
      throw HttpError(HttpStatus.INTERNAL_SERVER_ERROR, "something went wrong!")
    }

    try {
      circulation = await this.circulationsModel.create(circulationCollectionPayload)
    } catch (error) {
      this.logger.error(`error occurred while creating criculation details for ${this.validateCheckoutCirculationOrder.name}`)
      throw HttpError(HttpStatus.INTERNAL_SERVER_ERROR, "something went wrong!")
    }

    return "circulation details created successfully"

  }

  async returnCirculationOrder(createCirculationDto: CreateCirculationDto) {
    let { due_amount, book } = await this.validateReturnCirculationOrder(createCirculationDto)

    try {
      await this.booksModel.updateOne({ _id: createCirculationDto.book_id.toString() }, { $set: { number_of_copies: ++book.number_of_copies } })
    } catch (error) {
      this.logger.error(`error occurred while creating criculation details for ${this.validateCheckoutCirculationOrder.name}`)
      throw HttpError(HttpStatus.INTERNAL_SERVER_ERROR, "something went wrong!")
    }

    return {
      due_amount,
      book
    }

  }

  async validateCheckoutCirculationOrder(createCirculationDto: CreateCirculationDto) {
    let circulation, book;
    try {
      circulation = await this.circulationsModel.findOne({ book_id: createCirculationDto.book_id.toString(), member_id: createCirculationDto.member_id.toString(), is_active: true }).lean();
    } catch (error) {
      this.logger.error(`error occurred while finding criculation details for ${this.validateCheckoutCirculationOrder.name}`)
      throw HttpError(HttpStatus.INTERNAL_SERVER_ERROR, "something went wrong!")
    }

    if (circulation) {
      throw HttpError(HttpStatus.BAD_REQUEST, "Book is already checked out!")
    }

    try {
      book = await this.booksModel.findOne({ _id: createCirculationDto.book_id.toString(), is_active: true, number_of_copies: { $gt: 0 } }).lean()
    } catch (error) {
      this.logger.error(`error occurred while fetching Book details for ${this.validateCheckoutCirculationOrder.name}`)
      throw HttpError(HttpStatus.INTERNAL_SERVER_ERROR, "something went wrong!")
    }

    if (!book) {
      throw HttpError(HttpStatus.BAD_REQUEST, "Book that you want to checkout is not available!")
    }

    return book;

  }

  async validateReturnCirculationOrder(createCirculationDto: CreateCirculationDto) {
    let circulation: Circulations, book;

    try {
      book = await this.booksModel.findOne({ _id: createCirculationDto.book_id.toString(), is_active: true }).lean()
    } catch (error) {
      this.logger.error(`error occurred while fetching Book details for ${this.validateCheckoutCirculationOrder.name}`)
      throw HttpError(HttpStatus.INTERNAL_SERVER_ERROR, "something went wrong!")
    }

    if (!book) {
      throw HttpError(HttpStatus.BAD_REQUEST, "Book that return is not allowed!")
    }

    try {
      circulation = await this.circulationsModel.findOne({ book_id: createCirculationDto.book_id.toString(), member_id: createCirculationDto.member_id.toString(), is_active: true }).lean();
    } catch (error) {
      this.logger.error(`error occurred while finding criculation details for ${this.validateCheckoutCirculationOrder.name}`)
      throw HttpError(HttpStatus.INTERNAL_SERVER_ERROR, "something went wrong!")
    }

    if (!circulation) {
      throw HttpError(HttpStatus.BAD_REQUEST, "Book is not checked out!")
    }

    return { due_amount: await this.calculateDueAmount(circulation.due_date), book }

  }

  async calculateDueAmount(dueDate) {
    let today = moment(new Date())
    let return_date = moment(dueDate)

    let diff = today.diff(return_date, 'days')
    if (diff > 0) {
      return diff * 50
    }

    return 0;
  }

}
