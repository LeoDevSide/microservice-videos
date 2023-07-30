import { SortDirection } from '@me/micro-videos/src/@shared/domain'
import { CastMemberFilter } from '@me/micro-videos/src/cast-member/infra'
import { IsObject } from 'class-validator'

export class SearchCastMembersDTO {
  page?: number
  per_page?: number
  sort?: string
  sort_dir?: SortDirection
  @IsObject()
  filter?: CastMemberFilter
}
