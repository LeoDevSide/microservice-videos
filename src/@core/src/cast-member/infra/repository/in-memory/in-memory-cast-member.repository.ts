import {
  InMemorySearchableRepository,
  SortDirection,
} from '../../../../@shared/domain'
import { CastMemberEntity } from '../../../domain'
import {
  CastMemberFilter,
  ICastMemberRepository,
} from '../cast-member.repository'

export class InMemoryCastMemberRepository
  extends InMemorySearchableRepository<CastMemberEntity, CastMemberFilter>
  implements ICastMemberRepository
{
  sortableFields: string[] = ['name', 'createdAt', 'type']

  protected async applyFilter(
    filter: CastMemberFilter,
  ): Promise<CastMemberEntity[]> {
    if (!filter) return this.items
    const filteredItemsByName: CastMemberEntity[] = []

    if (filter.name) {
      filteredItemsByName.push(
        ...this.items.filter((item) => {
          return item.name.toLowerCase().includes(filter.name.toLowerCase())
        }),
      )
    }
    const filteredItemsByType: CastMemberEntity[] = []

    if (filter.type) {
      filteredItemsByType.push(
        ...(filter.name
          ? filteredItemsByName.filter((item) => {
              return item.type === filter.type
            })
          : this.items.filter((item) => {
              return item.type === filter.type
            })),
      )
    }
    return filter.type ? filteredItemsByType : filteredItemsByName
  }

  protected async applySort(
    items: CastMemberEntity[],
    sort: string | null,
    sortDir: SortDirection | null,
  ): Promise<CastMemberEntity[]> {
    if (!sort) return super.applySort(items, 'createdAt', 'desc')
    return super.applySort(items, sort, sortDir)
  }
}
