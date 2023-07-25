import { SortDirection } from '@me/micro-videos/src/@shared/domain'

export class SearchCategoriesDTO {
  page?: number
  per_page?: number
  sort?: string
  sort_dir?: SortDirection
  filter?: string
}
