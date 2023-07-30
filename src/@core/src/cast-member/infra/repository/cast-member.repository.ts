import {
  ISearchableRepository,
  SearchParams,
  SearchResult,
} from '../../../@shared/domain/repository/repository.contracts'
import {
  CastMemberEntity,
  CastMemberType,
} from '../../domain/entities/cast-member.entity'

export type CastMemberFilter = {
  name?: string
  type?: CastMemberType
}

export class CastMemberSearchParams extends SearchParams<CastMemberFilter> {}
export class CastMemberSearchResult extends SearchResult<
  CastMemberEntity,
  CastMemberFilter
> {}

export interface ICastMemberRepository
  extends ISearchableRepository<
    CastMemberEntity,
    CastMemberFilter,
    CastMemberSearchParams,
    CastMemberSearchResult
  > {}
