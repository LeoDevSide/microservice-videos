import UseCase from '../../../@shared/application/usecase'
import { IGenreRepository } from '../../infra/repository/genre.repository'

export type DeleteGenreUseCaseInputDTO = {
  id: string
}

export class DeleteGenreUseCase
  implements UseCase<DeleteGenreUseCaseInputDTO, void>
{
  constructor(private castMemberRepository: IGenreRepository) {}
  async execute(input: DeleteGenreUseCaseInputDTO): Promise<void> {
    const foundGenreEntity = await this.castMemberRepository.findById(input.id)
    if (foundGenreEntity) await this.castMemberRepository.delete(input.id)
  }
}
