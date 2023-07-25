import { Entity } from '../entity/entity'
import { NotFoundError } from '../errors/not-found.error'
import { UniqueEntityId } from '../value-objects/id.value-object'
import {
  IRepository,
  ISearchableRepository,
  SearchParams,
  SearchResult,
  SortDirection,
} from './repository.contracts'

export abstract class InMemoryRepository<E extends Entity>
  implements IRepository<E>
{
  items: E[] = []

  async insert(entity: E): Promise<void> {
    this.items.push(entity)
  }

  async bulkInsert(entities: E[]): Promise<void> {
    this.items.push(...entities)
  }

  async findById(id: string | UniqueEntityId): Promise<E | null> {
    const _id = `${id}`
    const foundItem = this._get(_id)
    if (!foundItem) {
      return null
    }
    return foundItem
  }

  async findAll(): Promise<E[]> {
    return this.items
  }

  async update(entity: E): Promise<void> {
    await this._get(entity.id)

    const indexFound = this.items.findIndex((item) => item.id === entity.id)
    // findIndex returns -1 when not found
    if (indexFound >= 0) {
      this.items[indexFound] = entity
    }
  }

  async delete(id: string | UniqueEntityId): Promise<void> {
    const _id = `${id}`
    await this._get(_id)

    const indexFound = this.items.findIndex((item) => item.id === _id)
    if (indexFound >= 0) {
      this.items.splice(indexFound, 1)
    }
  }

  protected async _get(id: string): Promise<E> {
    const item = this.items.find((item) => item.id === id)
    if (!item) {
      throw new NotFoundError(`Entity with id ${id} does not exist`)
    }
    return item
  }
}

export abstract class InMemorySearchableRepository<
    E extends Entity,
    Filter = string,
  >
  extends InMemoryRepository<E>
  implements ISearchableRepository<E, Filter>
{
  sortableFields: string[] = []

  async search(props: SearchParams<Filter>): Promise<SearchResult<E, Filter>> {
    const itemsFiltered = await this.applyFilter(this.items, props.filter)
    const itemsSorted = await this.applySort(
      itemsFiltered,
      props.sort,
      props.sortDir,
    )
    const itemsPaginated = await this.applyPaginate(
      itemsSorted,
      props.page,
      props.perPage,
    )
    return new SearchResult({
      items: itemsPaginated,
      total: itemsFiltered.length,
      currentPage: props.page,
      perPage: props.perPage,
      sort: props.sort,
      sortDir: props.sortDir,
      filter: props.filter,
    })
  }

  protected abstract applyFilter(
    items: E[],
    filter: Filter | null,
  ): Promise<E[]>

  protected async applySort(
    items: E[],
    sort: string | null,
    sortDir: SortDirection,
  ): Promise<E[]> {
    if (!sort || !this.sortableFields.includes(sort)) return items

    return [...items].sort((a, b) => {
      if (a.props[sort] < b.props[sort]) return sortDir === 'asc' ? -1 : 1
      if (a.props[sort] > b.props[sort]) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }

  protected async applyPaginate(
    items: E[],
    page: SearchParams['page'],
    perPage: SearchParams['perPage'],
  ): Promise<E[]> {
    const start = (page - 1) * perPage // 1 * 15 = 15
    const limit = start + perPage // 15 + 15 = 30
    return items.slice(start, limit)
  }
}

// if need to implement softdelete - mixin come here ,don't change existent abstractions
