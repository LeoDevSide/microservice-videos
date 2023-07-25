import {
  SearchInputDTO,
  SearchResultDTO,
} from '../../../@shared/application/dto/generic-search-input.dto'
import UseCase from '../../../@shared/application/usecase'
import {
  CategorySearchParams,
  ICategoryRepository,
} from '../../infra/repository/category.repository'
import { CategoryOutputDTO } from './dto/generic-output-category.dto'

export type FetchCategoriesInputDTO = SearchInputDTO

export type FetchCategoriesOutputDTO = SearchResultDTO<CategoryOutputDTO>

export class FetchCategoriesUseCase
  implements UseCase<FetchCategoriesInputDTO, FetchCategoriesOutputDTO>
{
  constructor(private categoryRepository: ICategoryRepository) {}
  async execute(
    input: FetchCategoriesInputDTO,
  ): Promise<FetchCategoriesOutputDTO> {
    const params = new CategorySearchParams({
      filter: input.filter,
      page: input.page,
      perPage: input.per_page,
      sort: input.sort,
      sortDir: input.sort_dir,
    })

    const foundCategoriesList = await this.categoryRepository.search(params)

    const listInJson = foundCategoriesList.items.map((category) =>
      category.toJSON(),
    )

    // TODO : consider use mapper instead
    const output: FetchCategoriesOutputDTO = {
      items: listInJson,
      current_page: foundCategoriesList.currentPage,
      last_page: foundCategoriesList.lastPage,
      total: foundCategoriesList.total,
      per_page: foundCategoriesList.perPage,
    }

    return output
  }
}
