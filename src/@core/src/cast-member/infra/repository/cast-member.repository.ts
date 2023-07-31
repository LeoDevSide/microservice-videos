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

export class CastMemberSearchParams extends SearchParams<CastMemberFilter> {
  get filter(): CastMemberFilter | null {
    return this._filter
  }

  set filter(value: CastMemberFilter | null) {
    const normalizeFilter: CastMemberFilter = value
      ? {
          name: value.name ? value.name : undefined,
          type: value.type ? Number(value.type) : undefined,
        }
      : undefined

    this._filter =
      value === null || value === undefined || (value as unknown) === ''
        ? null
        : normalizeFilter
  }
}
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
