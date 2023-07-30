import { SearchInputDTO, SearchResultDTO } from '../../../@shared/application'
import UseCase from '../../../@shared/application/usecase'
import {
  CastMemberFilter,
  CastMemberSearchParams,
  ICastMemberRepository,
} from '../../infra/repository/cast-member.repository'
import { CastMemberUseCaseOutputDTO } from './dto/generic-output-cast-member.dto'

export type FetchCastMembersInputDTO = SearchInputDTO<CastMemberFilter>

export type FetchCastMembersOutputDTO =
  SearchResultDTO<CastMemberUseCaseOutputDTO>

export class FetchCastMembersUseCase
  implements UseCase<FetchCastMembersInputDTO, FetchCastMembersOutputDTO>
{
  constructor(private castMemberRepository: ICastMemberRepository) {}
  async execute(
    input: FetchCastMembersInputDTO,
  ): Promise<FetchCastMembersOutputDTO> {
    const params = new CastMemberSearchParams({
      filter: input.filter,
      page: input.page,
      perPage: input.per_page,
      sort: input.sort,
      sortDir: input.sort_dir,
    })
    /// params.filter.name == undefined
    const foundCastMembersList = await this.castMemberRepository.search(params)
    const listInJson = foundCastMembersList.toJSON()
    // TODO : consider use mapper instead
    const output = listInJson

    return output
  }
}
