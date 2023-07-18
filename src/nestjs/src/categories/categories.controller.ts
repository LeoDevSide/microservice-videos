import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  Put,
  Query,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  CreateCategoryUseCase,
  FetchCategoriesUseCase,
  GetCategoryUseCase,
  UpdateCategoryUsecase,
} from '@me/micro-videos/src/category/application';
import { SearchCategoriesDTO } from './dto/search-categories.dto';

@Controller('categories')
export class CategoriesController {
  @Inject(CreateCategoryUseCase)
  private createCategoryUseCase: CreateCategoryUseCase;
  @Inject(FetchCategoriesUseCase)
  private fetchCategoriesUseCase: FetchCategoriesUseCase;
  @Inject(UpdateCategoryUsecase)
  private updateCategoryUseCase: UpdateCategoryUsecase;
  @Inject(GetCategoryUseCase)
  private getCategorysUseCase: GetCategoryUseCase;

  @Post()
  async create(@Body() input: CreateCategoryDto) {
    return await this.createCategoryUseCase.execute({
      name: input.name,
      description: input.description,
      isActive: input.is_active,
    });
    // return await this.categoriesService.create({ name: 'test' });
  }

  @Get()
  async search(@Query() searchParams: SearchCategoriesDTO) {
    return await this.fetchCategoriesUseCase.execute(searchParams);
    // return await this.categoriesService.search({});
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.getCategorysUseCase.execute({ id });
    // return this.categoriesService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.updateCategoryUseCase.execute({
      id,
      ...updateCategoryDto,
    });
    // return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // return this.categoriesService.remove(+id);
  }
}
