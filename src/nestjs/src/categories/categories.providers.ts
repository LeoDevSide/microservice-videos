/* eslint-disable @typescript-eslint/no-namespace */
import {
  CreateCategoryUseCase,
  FetchCategoriesUseCase,
  GetCategoryUseCase,
  UpdateCategoryUsecase,
} from '@me/micro-videos/src/category/application';
import {
  ICategoryRepository,
  InMemoryCategoryRepository,
} from '@me/micro-videos/src/category/infra';

export namespace CATEGORY_PROVIDERS {
  export namespace REPOSITORIES {
    export const CATEGORY_IN_MEMORY_REPOSITORY = {
      provide: 'CategoryRepository',
      useClass: InMemoryCategoryRepository,
    };
  }
  export namespace USE_CASES {
    export const CREATE_CATEGORY_USE_CASE = {
      provide: CreateCategoryUseCase,
      useFactory: (categoryRepository: ICategoryRepository) => {
        return new CreateCategoryUseCase(categoryRepository);
      },
      inject: [REPOSITORIES.CATEGORY_IN_MEMORY_REPOSITORY.provide],
    };
    export const FETCH_CATEGORIES_USE_CASE = {
      provide: FetchCategoriesUseCase,
      useFactory: (categoryRepository: ICategoryRepository) => {
        return new FetchCategoriesUseCase(categoryRepository);
      },
      inject: [REPOSITORIES.CATEGORY_IN_MEMORY_REPOSITORY.provide],
    };
    export const UPDATE_CATEGORY_USE_CASE = {
      provide: UpdateCategoryUsecase,
      useFactory: (categoryRepository: ICategoryRepository) => {
        return new UpdateCategoryUsecase(categoryRepository);
      },
      inject: [REPOSITORIES.CATEGORY_IN_MEMORY_REPOSITORY.provide],
    };
    export const GET_CATEGORY_USE_CASE = {
      provide: GetCategoryUseCase,
      useFactory: (categoryRepository: ICategoryRepository) => {
        return new GetCategoryUseCase(categoryRepository);
      },
      inject: [REPOSITORIES.CATEGORY_IN_MEMORY_REPOSITORY.provide],
    };
  }
}
