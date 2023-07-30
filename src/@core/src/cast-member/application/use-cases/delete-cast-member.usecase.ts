import UseCase from '../../../@shared/application/usecase'
import { ICastMemberRepository } from '../../infra/repository/cast-member.repository'

export type DeleteCastMemberUseCaseInputDTO = {
  id: string
}

export class DeleteCastMemberUseCase
  implements UseCase<DeleteCastMemberUseCaseInputDTO, void>
{
  constructor(private castMemberRepository: ICastMemberRepository) {}
  async execute(input: DeleteCastMemberUseCaseInputDTO): Promise<void> {
    const foundCastMemberEntity = await this.castMemberRepository.findById(
      input.id,
    )
    if (foundCastMemberEntity) await this.castMemberRepository.delete(input.id)
  }
}
