import {
  InMemorySearchableRepository,
  SortDirection,
} from '../../../../@shared/domain'
import { GenreEntity } from '../../../domain'
import { GenreFilter, IGenreRepository } from '../genre.repository'

export class InMemoryGenreRepository
  extends InMemorySearchableRepository<GenreEntity, GenreFilter>
  implements IGenreRepository
{
  sortableFields: string[] = ['name', 'createdAt']

  protected async applyFilter(filter: GenreFilter): Promise<GenreEntity[]> {
    if (!filter) return this.items

    const filteredItemsByName: Set<GenreEntity> = filter.name
      ? new Set(
          this.items.filter((item) =>
            item.name.toLowerCase().includes(filter.name.toLowerCase()),
          ),
        )
      : new Set(this.items)

    const filteredItemsByIsActive: Set<GenreEntity> =
      filter.is_active !== undefined
        ? new Set(
            this.items.filter((item) => item.isActive === filter.is_active),
          )
        : new Set(this.items)

    const filteredItemsByCategoryId: Set<GenreEntity> = filter.categoryId
      ? new Set(
          this.items.filter((item) => item.categoriesId.has(filter.categoryId)),
        )
      : new Set(this.items)

    const filteredItems = this.items.filter(
      (item) =>
        filteredItemsByName.has(item) &&
        filteredItemsByIsActive.has(item) &&
        filteredItemsByCategoryId.has(item),
    )

    return filteredItems
  }

  protected async applySort(
    items: GenreEntity[],
    sort: string | null,
    sortDir: SortDirection | null,
  ): Promise<GenreEntity[]> {
    if (!sort) return super.applySort(items, 'createdAt', 'desc')
    return super.applySort(items, sort, sortDir)
  }
}
