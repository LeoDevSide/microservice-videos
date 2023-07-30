import {
  InMemorySearchableRepository,
  SortDirection,
} from '../../../../@shared/domain'
import { CategoryEntity } from '../../../domain'
import { CategoryFilter, ICategoryRepository } from '../category.repository'

export class InMemoryCategoryRepository
  extends InMemorySearchableRepository<CategoryEntity>
  implements ICategoryRepository
{
  sortableFields: string[] = ['name', 'createdAt']
  protected async applyFilter(
    filter: CategoryFilter,
  ): Promise<CategoryEntity[]> {
    if (!filter) return this.items
    return this.items.filter((item) => {
      return item.name.toLowerCase().includes(filter.toLowerCase())
    })
  }

  protected async applySort(
    items: CategoryEntity[],
    sort: string | null,
    sortDir: SortDirection | null,
  ): Promise<CategoryEntity[]> {
    if (!sort) return super.applySort(items, 'createdAt', 'desc')
    return super.applySort(items, sort, sortDir)
  }
}
