import { CategoryEntity } from '../../domain'
import { InMemorySearchableRepository } from '../../../@shared/domain/repository/in-memory.repository'
import { SortDirection } from '../../../@shared/domain/repository/repository.contracts'
import { CategoryFilter, ICategoryRepository } from './category.repository'

export class InMemoryCategoryRepository
  extends InMemorySearchableRepository<CategoryEntity>
  implements ICategoryRepository
{
  sortableFields: string[] = ['name', 'createdAt']
  protected async applyFilter(
    items: CategoryEntity[],
    filter: CategoryFilter,
  ): Promise<CategoryEntity[]> {
    if (!filter) return items
    return items.filter((item) => {
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
