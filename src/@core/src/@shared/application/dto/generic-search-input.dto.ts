import { SortDirection } from '../../domain/repository/repository.contracts'

export type Filter = string
export type SearchInputDTO<Filter> = {
  page?: number
  per_page?: number
  sort?: string | null
  sort_dir?: SortDirection
  filter?: Filter | null
}
export type SearchResultDTO<ItemType> = {
  items: ItemType[]
  total: number
  current_page: number
  per_page: number
  last_page: number
}
