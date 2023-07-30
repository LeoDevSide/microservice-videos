import { Entity } from '../../entity'
import { SearchParams, SearchResult } from '../repository.contracts'

class StubEntity extends Entity {
  toJSON() {
    return this
  }
}
const stubEntityArray = [
  new StubEntity({}),
  new StubEntity({}),
  new StubEntity({}),
  new StubEntity({}),
]
describe('SearchParams Unit Tests', () => {
  test('page property', () => {
    const arrange = [
      { page: null, expected: 1 },
      { page: 0, expected: 1 },
      { page: -1, expected: 1 },
      { page: 2.1, expected: 1 },
      { page: true, expected: 1 },
      { page: false, expected: 1 },
      { page: {}, expected: 1 },
      { page: '', expected: 1 },
      { page: undefined, expected: 1 },

      { page: '1', expected: 1 },
      { page: '2', expected: 2 },
    ]
    arrange.forEach((item) => {
      const searchParams = new SearchParams({ page: item.page as any })
      expect(searchParams.page).toBe(item.expected)
    })
  })
  test('perPage property', () => {
    const arrange = [
      { perPage: null, expected: 15 },
      { perPage: 0, expected: 15 },
      { perPage: -1, expected: 15 },
      { perPage: 2.1, expected: 15 },
      { perPage: true, expected: 15 },
      { perPage: false, expected: 15 },
      { perPage: {}, expected: 15 },
      { perPage: '', expected: 15 },
      { perPage: undefined, expected: 15 },

      { perPage: '1', expected: 1 },
      { perPage: '2', expected: 2 },
    ]
    arrange.forEach((item) => {
      const searchParams = new SearchParams({ perPage: item.perPage as any })
      expect(searchParams.perPage).toBe(item.expected)
    })
  })
  test('sort property', () => {
    const arrange = [
      { sort: 0, expected: '0' },
      { sort: -1, expected: '-1' },
      { sort: 2.1, expected: '2.1' },
      { sort: true, expected: 'true' },
      { sort: false, expected: 'false' },
      { sort: {}, expected: '[object Object]' },
      { sort: '', expected: null },
      { sort: undefined, expected: null },
      { sort: 'anything', expected: 'anything' },
      { sort: null, expected: null },
    ]
    arrange.forEach((item) => {
      const searchParams = new SearchParams({ sort: item.sort as any })
      expect(searchParams.sort).toBe(item.expected)
    })
  })
  test('sortDir property without sort defined', () => {
    const arrange: { sort?: any; sortDir?: any; expected: any }[] = [
      { sort: null, sortDir: 0, expected: null },
      { sortDir: -1, expected: null },
      { sortDir: 2.1, expected: null },
      { sortDir: true, expected: null },
      { sortDir: false, expected: null },
      { sortDir: {}, expected: null },
      { sortDir: '', expected: null },
      { sortDir: undefined, expected: null },
      { sortDir: 'anything', expected: null },
      { sortDir: null, expected: null },
      { sort: null, expected: null },
      { sort: undefined, expected: null },
      { sort: '', expected: null },
    ]
    arrange.forEach((item) => {
      const searchParams = new SearchParams({
        sort: item.sort,
        sortDir: item.sortDir as any,
      })
      expect(searchParams.sortDir).toBe(item.expected)
    })
  })

  test('sortDir property with sort defined', () => {
    const arrange: { sort?: any; sortDir?: any; expected: any }[] = [
      { sortDir: 0, expected: 'asc' },
      { sortDir: -1, expected: 'asc' },
      { sortDir: 2.1, expected: 'asc' },
      { sortDir: true, expected: 'asc' },
      { sortDir: false, expected: 'asc' },
      { sortDir: {}, expected: 'asc' },
      { sortDir: '', expected: 'asc' },
      { sortDir: undefined, expected: 'asc' },
      { sortDir: 'anything', expected: 'asc' },
      { sortDir: null, expected: 'asc' },

      { sortDir: 'asc', expected: 'asc' },
      { sortDir: 'desc', expected: 'desc' },

      { sortDir: 'ASC', expected: 'asc' },
      { sortDir: 'DESC', expected: 'desc' },
    ]
    arrange.forEach((item) => {
      const searchParams = new SearchParams({
        sort: 'field',
        sortDir: item.sortDir as any,
      })
      expect(searchParams.sortDir).toBe(item.expected)
    })
  })
  test('filter property', () => {
    const searchParams = new SearchParams()
    expect(searchParams.filter).toBeNull()

    const arrange = [
      { filter: 0, expected: 0 },
      { filter: 'a', expected: 'a' },
      { filter: 2.1, expected: 2.1 },
      { filter: true, expected: true },
      { filter: false, expected: false },
      { filter: {}, expected: {} },
      {
        filter: { prop1: 's', prop2: 2, prop3: {}, prop4: [] },
        expected: { prop1: 's', prop2: 2, prop3: {}, prop4: [] },
      },

      { filter: '', expected: null },
      { filter: undefined, expected: null },
      { filter: 'anything', expected: 'anything' },
      { filter: null, expected: null },
    ]

    arrange.forEach((item) => {
      const searchParams = new SearchParams({ filter: item.filter as any })
      expect(searchParams.filter).toStrictEqual(item.expected)
    })
  })
})

describe('SearchResult Unit Tests', () => {
  test('constructor props', () => {
    let searchResult = new SearchResult({
      items: stubEntityArray,
      total: 4,
      currentPage: 1,
      perPage: 2,
      filter: null,
      sort: null,
      sortDir: null,
    })
    expect(searchResult.toJSON()).toStrictEqual({
      items: stubEntityArray,
      total: 4,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    })

    searchResult = new SearchResult({
      items: stubEntityArray as any,
      total: 5,
      currentPage: 1,
      perPage: 2,
      filter: 'test',
      sort: 'name',
      sortDir: 'asc',
    })
    expect(searchResult.toJSON()).toStrictEqual({
      items: stubEntityArray,
      total: 5,
      current_page: 1,
      per_page: 2,
      last_page: 3,
    })
  })
  it('should set "last_page=1" when "per_page>total" ', () => {
    const searchResult = new SearchResult({
      total: 4,
      perPage: 10,
      items: stubEntityArray as any,
      currentPage: 1,
      filter: null,
      sort: null,
      sortDir: null,
    })
    expect(searchResult.toJSON()).toStrictEqual({
      items: stubEntityArray,
      total: 4,
      per_page: 10,
      current_page: 1,
      last_page: 1,
    })
  })
})
