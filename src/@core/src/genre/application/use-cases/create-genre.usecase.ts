import UseCase from '../../../@shared/application/usecase'
import { GenreEntity } from '../../domain/entities/genre.entity'
import { IGenreRepository } from '../../infra/repository/genre.repository'

export type CreateGenreInputDTO = {
  name: string
  is_active?: boolean

  categories_id: string[]
}

export type CreateGenreOutputDTO = {
  id: string
  name: string
  is_active: boolean
  created_at: Date

  categories_id: string[]
}

export class CreateGenreUseCase
  implements UseCase<CreateGenreInputDTO, CreateGenreOutputDTO>
{
  constructor(private castMemberRepository: IGenreRepository) {}
  async execute(input: CreateGenreInputDTO): Promise<CreateGenreOutputDTO> {
    const castMemberEntity = GenreEntity.create({
      name: input.name,
      isActive: input.is_active,

      categoriesId: input.categories_id,
    })
    await this.castMemberRepository.insert(castMemberEntity)

    const output: CreateGenreOutputDTO = castMemberEntity.toJSON()
    return output
  }
}
