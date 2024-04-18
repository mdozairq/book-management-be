import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, HttpStatus } from '@nestjs/common';
import { CirculationsService } from './circulations.service';
import { CreateCirculationDto, EventType, createCheckoutCirculationValidation, createReturnCirculationValidation, } from './dto/create-circulation.dto';

import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpError } from 'src/errors/custom.errors';
import { Roles } from 'src/role/role-decorators';
import { Role } from 'src/role/role-guard';

@Controller('circulations')
@ApiTags('circulations')
export class CirculationsController {
  private readonly logger = new Logger(CirculationsController.name);
  constructor(private readonly circulationsService: CirculationsService) { }

  @Post('/checkout')
  @Roles(Role.ADMIN)
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token needed',
  })
  @ApiOperation({
    summary: 'Checkout Books',
    description: 'Checkout Books Description',
  })
  @ApiResponse({
    status: 201,
    description: 'A Book successfully Checked out!',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiResponse({
    status: HttpStatus.PRECONDITION_FAILED,
    description: 'Failed Precondition.',
  })
  async createBorrow(@Body() createCirculationDto: CreateCirculationDto) {
    try {
      await createCheckoutCirculationValidation.validateAsync(createCirculationDto);
    } catch (error) {
      this.logger.error(`Inside ${this.createBorrow.name}:${error.message}`);
      throw HttpError(
        HttpStatus.PRECONDITION_FAILED,
        `Invalid Request object:${error.message}`,
      );
    }
    return await this.circulationsService.checkoutCirculationOrder(createCirculationDto);

  }


  @Post('/return')
  @Roles(Role.ADMIN)
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token needed',
  })
  @ApiOperation({
    summary: 'Return Books',
    description: 'Return Books Description',
  })
  @ApiResponse({
    status: 201,
    description: 'A Book successfully Returned!',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiResponse({
    status: HttpStatus.PRECONDITION_FAILED,
    description: 'Failed Precondition.',
  })
  async returnCirculation(@Body() createCirculationDto: CreateCirculationDto) {
    try {
      await createReturnCirculationValidation.validateAsync(createCirculationDto);
    } catch (error) {
      this.logger.error(`Inside ${this.createBorrow.name}:${error.message}`);
      throw HttpError(
        HttpStatus.PRECONDITION_FAILED,
        `Invalid Request object:${error.message}`,
      );
    }
    return await this.circulationsService.returnCirculationOrder(createCirculationDto);

  }

}
