import UseCase from '../../../@shared/application/usecase'
import { CastMemberType } from '../../domain'
import { ICastMemberRepository } from '../../infra/repository/cast-member.repository'

type UpdateCastMemberInputDTO = {
  id: string
  name?: string
  type?: CastMemberType
}

export type UpdateCastMemberOutputDTO = {
  id: string
  name: string
  type: CastMemberType
  created_at: Date
}

export class UpdateCastMemberUseCase
  implements UseCase<UpdateCastMemberInputDTO, UpdateCastMemberOutputDTO>
{
  constructor(private castMemberRepository: ICastMemberRepository) {}
  async execute(
    input: UpdateCastMemberInputDTO,
  ): Promise<UpdateCastMemberOutputDTO> {
    const foundCastMemberEntity = await this.castMemberRepository.findById(
      input.id,
    )

    foundCastMemberEntity.update({
      type: input.type ?? foundCastMemberEntity.type,
      name: input.name ?? foundCastMemberEntity.name,
    })

    await this.castMemberRepository.update(foundCastMemberEntity)

    const output: UpdateCastMemberOutputDTO = foundCastMemberEntity.toJSON()
    return output
  }
}
