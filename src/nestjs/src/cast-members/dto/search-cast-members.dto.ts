import { SortDirection } from '@me/micro-videos/src/@shared/domain'
import { CastMemberFilter } from '@me/micro-videos/src/cast-member/infra'

export class SearchCastMembersDTO {
  page?: number
  per_page?: number
  sort?: string
  sort_dir?: SortDirection
  filter?: CastMemberFilter
}
