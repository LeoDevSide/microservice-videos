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
  ParseUUIDPipe,
} from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import {
  CategoryOutputDTO,
  CreateCategoryUseCase,
  FetchCategoriesUseCase,
  GetCategoryUseCase,
  UpdateCategoryUsecase,
} from '@me/micro-videos/src/category/application'
import { SearchCategoriesDTO } from './dto/search-categories.dto'
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from './presenter/categories.presenter'

@Controller('categories')
export class CategoriesController {
  @Inject(CreateCategoryUseCase)
  private createCategoryUseCase: CreateCategoryUseCase

  @Inject(FetchCategoriesUseCase)
  private fetchCategoriesUseCase: FetchCategoriesUseCase

  @Inject(UpdateCategoryUsecase)
  private updateCategoryUseCase: UpdateCategoryUsecase

  @Inject(GetCategoryUseCase)
  private getCategorysUseCase: GetCategoryUseCase

  static toResponse(output: CategoryOutputDTO) {
    return new CategoryPresenter(output)
  }

  @Post()
  async create(@Body() input: CreateCategoryDto) {
    const output = await this.createCategoryUseCase.execute({
      name: input.name,
      description: input.description,
      isActive: input.is_active,
    })
    return new CategoryPresenter(output)
  }

  @Get()
  async search(@Query() searchParams: SearchCategoriesDTO) {
    const output = await this.fetchCategoriesUseCase.execute(searchParams)
    return new CategoryCollectionPresenter(output)

    // return await this.categoriesService.search({});
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    const output = await this.getCategorysUseCase.execute({ id })
    return new CategoryPresenter(output)
    // return this.categoriesService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const output = await this.updateCategoryUseCase.execute({
      id,
      ...updateCategoryDto,
    })
    return new CategoryPresenter(output)
    // return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // return this.categoriesService.remove(+id);
  }
}
