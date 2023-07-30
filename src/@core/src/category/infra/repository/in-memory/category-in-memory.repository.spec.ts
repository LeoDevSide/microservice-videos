/* eslint-disable dot-notation */
import { CategoryEntity } from '../../../domain'
import { InMemoryCategoryRepository } from './category-in-memory.repository'

describe('CategoryInMemoryRepository', () => {
  let repository: InMemoryCategoryRepository

  beforeEach(() => (repository = new InMemoryCategoryRepository()))
  it('should no filter items when filter object is null', async () => {
    const items = [new CategoryEntity({ name: 'test' })]
    const filterSpy = jest.spyOn(items, 'filter' as any)
    repository.items = items
    const itemsFiltered = await repository['applyFilter'](null)
    expect(filterSpy).not.toHaveBeenCalled()
    expect(repository.items).toStrictEqual(itemsFiltered)
  })

  it('should filter items using filter parameter', async () => {
    const items = [
      new CategoryEntity({ name: 'test' }),
      new CategoryEntity({ name: 'TEST' }),
      new CategoryEntity({ name: 'fake' }),
    ]
    const filterSpy = jest.spyOn(items, 'filter' as any)
    repository.items = items
    const itemsFiltered = await repository['applyFilter']('TEST')
    expect(filterSpy).toHaveBeenCalledTimes(1)
    expect(itemsFiltered).toStrictEqual([items[0], items[1]])
  })

  it('should sort by created_at when sort param is null', async () => {
    const createdAt = new Date()
    const createdAt1 = new Date(createdAt.getTime() + 100)
    const createdAt2 = new Date(createdAt.getTime() + 200)
    const createdAt3 = new Date(createdAt.getTime() + 300)

    const items = [
      new CategoryEntity({
        name: 'test',
        createdAt: createdAt1,
      }),
      new CategoryEntity({
        name: 'TEST',
        createdAt: createdAt3,
      }),
      new CategoryEntity({
        name: 'fake',
        createdAt: createdAt2,
      }),
    ]
    repository.items = items

    const itemsSorted = await repository['applySort'](items, null, null)
    expect(itemsSorted).toStrictEqual([items[1], items[2], items[0]])
  })

  it('should sort by name', async () => {
    const items = [
      new CategoryEntity({ name: 'c' }),
      new CategoryEntity({ name: 'b' }),
      new CategoryEntity({ name: 'a' }),
    ]
    repository.items = items
    let itemsSorted = await repository['applySort'](items, 'name', 'asc')
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]])

    itemsSorted = await repository['applySort'](items, 'name', 'desc')
    expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]])
  })
})
