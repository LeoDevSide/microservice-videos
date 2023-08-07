import {
  ISearchableRepository,
  SearchParams,
  SearchResult,
} from '../../../@shared/domain/repository/repository.contracts'
import { GenreEntity } from '../../domain/entities/genre.entity'

export type GenreFilter = {
  name?: string
  categoryId?: string
  is_active?: boolean
}

export class GenreSearchParams extends SearchParams<GenreFilter> {}
export class GenreSearchResult extends SearchResult<GenreEntity, GenreFilter> {}

export interface IGenreRepository
  extends ISearchableRepository<
    GenreEntity,
    GenreFilter,
    GenreSearchParams,
    GenreSearchResult
  > {}
