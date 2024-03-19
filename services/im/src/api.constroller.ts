import { ApiExceptionFilter } from '../../../libs/common/src';
import { Controller, Get, UseFilters } from '@nestjs/common';

@Controller()
@UseFilters(new ApiExceptionFilter())
export class ApiController {
  constructor() {}

  @Get()
  async Hello() {
    return 'Hello World';
  }
}
