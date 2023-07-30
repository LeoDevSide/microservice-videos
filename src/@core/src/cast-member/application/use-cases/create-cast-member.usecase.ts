import UseCase from '../../../@shared/application/usecase'
import {
  CastMemberEntity,
  CastMemberType,
} from '../../domain/entities/cast-member.entity'
import { ICastMemberRepository } from '../../infra/repository/cast-member.repository'

export type CreateCastMemberInputDTO = {
  name: string
  type: CastMemberType
}

export type CreateCastMemberOutputDTO = {
  id: string
  name: string
  type: CastMemberType
  created_at: Date
}

export class CreateCastMemberUseCase
  implements UseCase<CreateCastMemberInputDTO, CreateCastMemberOutputDTO>
{
  constructor(private castMemberRepository: ICastMemberRepository) {}
  async execute(
    input: CreateCastMemberInputDTO,
  ): Promise<CreateCastMemberOutputDTO> {
    const castMemberEntity = new CastMemberEntity({
      name: input.name,
      type: input.type,
    })
    await this.castMemberRepository.insert(castMemberEntity)

    const output: CreateCastMemberOutputDTO = castMemberEntity.toJSON()
    return output
  }
}
