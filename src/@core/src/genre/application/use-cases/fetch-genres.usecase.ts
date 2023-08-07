import { SearchInputDTO, SearchResultDTO } from '../../../@shared/application'
import UseCase from '../../../@shared/application/usecase'
import {
  GenreFilter,
  GenreSearchParams,
  IGenreRepository,
} from '../../infra/repository/genre.repository'
import { GenreUseCaseOutputDTO } from './dto/generic-output-genre.dto'

export type FetchGenresInputDTO = SearchInputDTO<GenreFilter>

export type FetchGenresOutputDTO = SearchResultDTO<GenreUseCaseOutputDTO>

export class FetchGenresUseCase
  implements UseCase<FetchGenresInputDTO, FetchGenresOutputDTO>
{
  constructor(private genreRepository: IGenreRepository) {}
  async execute(input: FetchGenresInputDTO): Promise<FetchGenresOutputDTO> {
    const params = new GenreSearchParams({
      filter: input.filter,
      page: input.page,
      perPage: input.per_page,
      sort: input.sort,
      sortDir: input.sort_dir,
    })
    const foundGenresList = await this.genreRepository.search(params)
    const listInJson = foundGenresList.toJSON()
    // TODO : consider use mapper instead
    const output = listInJson

    return output
  }
}
