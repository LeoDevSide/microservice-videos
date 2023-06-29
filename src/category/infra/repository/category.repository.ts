import {
  ISearchableRepository,
  SearchParams,
  SearchResult,
} from '../../../@shared/domain/repository/repository.contracts'
import { CategoryEntity } from '../../domain/entities/category.entity'

export type CategoryFilter = string

export class CategorySearchParams extends SearchParams<CategoryFilter> {}
export class CategorySearchResult extends SearchResult<
  CategoryEntity,
  CategoryFilter
> {}

export interface ICategoryRepository
  extends ISearchableRepository<
    CategoryEntity,
    CategoryFilter,
    CategorySearchParams,
    CategorySearchResult
  > {}
