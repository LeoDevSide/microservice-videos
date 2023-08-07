import { SortDirection } from '@me/micro-videos/src/@shared/domain'
import { GenreFilter } from '@me/micro-videos/src/genre/infra'
import { IsObject, IsOptional } from 'class-validator'
export class SearchGenresDTO {
  page?: number
  per_page?: number
  sort?: string
  sort_dir?: SortDirection

  @IsObject()
  @IsOptional()
  filter?: GenreFilter
}
