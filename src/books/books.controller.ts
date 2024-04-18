import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Roles } from 'src/role/role-decorators';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/role/role-guard';

@Controller('books')
@ApiTags('Books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get('/all')
  @Roles(Role.ADMIN)
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token needed',
  })
  @ApiOperation({
    summary: 'Find All Books',
    description: 'Find All Books Description',
  })
  @ApiResponse({
    status: 201,
    description: 'All Books successfully Found!',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiResponse({
    status: HttpStatus.PRECONDITION_FAILED,
    description: 'Failed Precondition.',
  })
  async findAll(
    @Query('page') page: string,
    @Query('page_size') page_size: string
  ) {
    return await this.booksService.findAllAvailableBooks(parseInt(page), parseInt(page_size));
  }
}
