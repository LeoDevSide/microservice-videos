import UseCase from '../../../@shared/application/usecase'
import { UniqueEntityId } from '../../../@shared/domain'
import { IGenreRepository } from '../../infra/repository/genre.repository'
import { GenreUseCaseOutputDTO } from './dto'

export type UpdateGenreInputDTO = {
  id: string
  name?: string
  is_active?: boolean

  categories_id?: string[]
}

export type UpdateGenreOutputDTO = GenreUseCaseOutputDTO
export class UpdateGenreUseCase
  implements UseCase<UpdateGenreInputDTO, UpdateGenreOutputDTO>
{
  constructor(private genreRepository: IGenreRepository) {}
  async execute(input: UpdateGenreInputDTO): Promise<UpdateGenreOutputDTO> {
    const foundGenreEntity = await this.genreRepository.findById(input.id)

    foundGenreEntity.update({
      name: input.name ?? foundGenreEntity.name,
    })
    if (input.is_active === true) foundGenreEntity.activate()
    if (input.is_active === false) foundGenreEntity.deactivate()

    const stringToValueObject: UniqueEntityId[] = input.categories_id.map(
      (stringId) => new UniqueEntityId(stringId),
    )
    foundGenreEntity.updateCategoriesId(stringToValueObject)

    await this.genreRepository.update(foundGenreEntity)

    const output: UpdateGenreOutputDTO = foundGenreEntity.toJSON()
    return output
  }
}
