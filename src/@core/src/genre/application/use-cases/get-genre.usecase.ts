import UseCase from '../../../@shared/application/usecase'
import { IGenreRepository } from '../../infra/repository/genre.repository'
import { GenreUseCaseOutputDTO } from './dto'

export type GetGenreUseCaseInputDTO = {
  id: string
}

export type GetGenreUseCaseOutputDTO = GenreUseCaseOutputDTO

export class GetGenreUseCase
  implements UseCase<GetGenreUseCaseInputDTO, GetGenreUseCaseOutputDTO>
{
  constructor(private genreRepository: IGenreRepository) {}
  async execute(
    input: GetGenreUseCaseInputDTO,
  ): Promise<GetGenreUseCaseOutputDTO> {
    const foundGenreEntity = await this.genreRepository.findById(input.id)

    if (!foundGenreEntity) {
      // TODO
    }

    const output: GetGenreUseCaseOutputDTO = foundGenreEntity.toJSON()
    return output
  }
}
