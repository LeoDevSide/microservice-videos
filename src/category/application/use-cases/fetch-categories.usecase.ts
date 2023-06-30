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

type InputDTO = SearchInputDTO

type OutputDTO = SearchResultDTO<CategoryOutputDTO>

export class FetchCategoriesUseCase implements UseCase<InputDTO, OutputDTO> {
  constructor(private categoryRepository: ICategoryRepository) {}
  async execute(input: InputDTO): Promise<OutputDTO> {
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
    const output: OutputDTO = {
      items: listInJson,
      current_page: foundCategoriesList.currentPage,
      last_page: foundCategoriesList.lastPage,
      total: foundCategoriesList.total,
    }

    return output
  }
}
