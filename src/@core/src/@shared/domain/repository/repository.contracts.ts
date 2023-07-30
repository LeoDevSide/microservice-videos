import { Entity } from '../entity/entity'
import { UniqueEntityId } from '../value-objects/id.value-object'

export interface IRepository<E extends Entity> {
  insert(entity: E): Promise<void>
  bulkInsert(entities: E[]): Promise<void>
  findById(id: string | UniqueEntityId): Promise<E | null>
  findAll(): Promise<E[]>
  update(entity: E): Promise<void>
  delete(id: string | UniqueEntityId): Promise<void>
}

export type SortDirection = 'asc' | 'desc'

export type SearchProps<Filter = string> = {
  page?: number
  perPage?: number
  sort?: string | null
  sortDir?: SortDirection | null
  filter?: Filter | null
}
// Value-Object like
// props comes from an external layer (request or messaging service)
export class SearchParams<Filter> {
  protected _page: number
  protected _perPage: number = 15
  protected _sort: string | null
  protected _sortDir: SortDirection | null
  protected _filter: Filter | null

  constructor(props: SearchProps<Filter> = {}) {
    this.page = props.page
    this.perPage = props.perPage
    this.sort = props.sort
    this.sortDir = props.sortDir
    this.filter = props.filter
  }

  get page() {
    return this._page
  }

  private set page(value: number) {
    let _page = Number(value)
    if (Number.isNaN(_page) || _page <= 0 || parseInt(_page as any) !== _page) {
      _page = 1
    }
    this._page = _page
  }

  get perPage() {
    return this._perPage
  }

  private set perPage(value: number) {
    let _perPage = Number(value)
    if (
      value === (true as any) ||
      Number.isNaN(_perPage) ||
      _perPage <= 0 ||
      parseInt(_perPage as any) !== _perPage
    ) {
      _perPage = this._perPage
    }
    this._perPage = _perPage
  }

  get sort(): string | null {
    return this._sort
  }

  private set sort(value: string | null) {
    this._sort =
      value === null || value === undefined || value === '' ? null : `${value}`
  }

  get sortDir(): SortDirection | null {
    return this._sortDir
  }

  private set sortDir(value: string | null) {
    if (!this.sort) {
      this._sortDir = null
      return
    }
    const dir = `${value}`.toLowerCase()
    this._sortDir = dir !== 'asc' && dir !== 'desc' ? 'asc' : dir
  }

  get filter(): Filter | null {
    return this._filter
  }

  private set filter(value: Filter | null) {
    this._filter =
      value === null || value === undefined || (value as unknown) === ''
        ? null
        : value
  }
}

type SearchResultProps<E extends Entity, Filter> = {
  items: E[] // define entity type on repositories
  total: number
  currentPage: number
  perPage: number
  sort: string | null
  sortDir: string | null
  filter: Filter | null // define filter on repositories if necessary
}
// Value-Object like
// not comes from request, repository use this in a response to external layers
export class SearchResult<E extends Entity, Filter = string> {
  readonly items: E[] // define entity type on repositories
  readonly total: number
  readonly currentPage: number
  readonly perPage: number
  readonly lastPage: number
  readonly sort: string | null
  readonly sortDir: string | null
  readonly filter: Filter // define filter on repositories if necessary

  constructor(props: SearchResultProps<E, Filter>) {
    this.items = props.items
    this.total = props.total
    this.currentPage = props.currentPage
    this.perPage = props.perPage
    this.lastPage = Math.ceil(this.total / this.perPage) // 101 items / 20 per page -> 5.0123456 -> output: lastPage: 6
    this.sort = props.sort ?? null
    this.sortDir = props.sortDir ?? null
    this.filter = props.filter ?? null
  }

  toJSON() {
    return {
      items: this.items.map((item) => item.toJSON()),
      total: this.total,
      current_page: this.currentPage,
      per_page: this.perPage,
      last_page: this.lastPage,
    }
  }
}

export interface ISearchableRepository<
  E extends Entity,
  Filter,
  SearchInput = SearchParams<Filter>,
  SearchOutput = SearchResult<E, Filter>,
> extends IRepository<E> {
  sortableFields: string[]
  search(props: SearchInput): Promise<SearchOutput>
}
