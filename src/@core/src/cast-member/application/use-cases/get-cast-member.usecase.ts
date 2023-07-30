import UseCase from '../../../@shared/application/usecase'
import { CastMemberType } from '../../domain'
import { ICastMemberRepository } from '../../infra/repository/cast-member.repository'

export type GetCastMemberUseCaseInputDTO = {
  id: string
}

export type GetCastMemberUseCaseOutputDTO = {
  id: string
  name: string
  type: CastMemberType
  created_at: Date
}

export class GetCastMemberUseCase
  implements
    UseCase<GetCastMemberUseCaseInputDTO, GetCastMemberUseCaseOutputDTO>
{
  constructor(private castMemberRepository: ICastMemberRepository) {}
  async execute(
    input: GetCastMemberUseCaseInputDTO,
  ): Promise<GetCastMemberUseCaseOutputDTO> {
    const foundCastMemberEntity = await this.castMemberRepository.findById(
      input.id,
    )

    if (!foundCastMemberEntity) {
      // TODO
    }

    const output: GetCastMemberUseCaseOutputDTO = foundCastMemberEntity.toJSON()
    return output
  }
}
