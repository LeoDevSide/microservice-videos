import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UpdateCategoryUsecase } from '@me/micro-videos/src/category/application';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log(UpdateCategoryUsecase);
    console.log('hi');
    return this.appService.getHello();
  }
}
