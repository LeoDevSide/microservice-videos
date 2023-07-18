import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  CreateCategoryUseCase,
  FetchCategoriesInputDTO,
  FetchCategoriesUseCase,
  CreateCategoryInputDTO,
} from '@me/micro-videos/src/category/application';

@Injectable()
export class CategoriesService {
  @Inject(CreateCategoryUseCase)
  private createCategoryUseCase: CreateCategoryUseCase;
  @Inject(FetchCategoriesUseCase)
  private fetchCategoriesUseCase: FetchCategoriesUseCase;

  create(input: CreateCategoryInputDTO) {
    return this.createCategoryUseCase.execute(input);
  }

  search(input: FetchCategoriesInputDTO) {
    return this.fetchCategoriesUseCase.execute(input);
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
