/* eslint-disable dot-notation */
import { UniqueEntityId } from '../../../../@shared/domain'
import { GenreFakeBuilder } from '../../../domain'
import { InMemoryGenreRepository } from './in-memory-genre.repository'

describe('GenreInMemoryRepository', () => {
  let repository: InMemoryGenreRepository

  beforeEach(() => (repository = new InMemoryGenreRepository()))
  it('should no filter items when filter object is null', async () => {
    const makeFake = GenreFakeBuilder.aGenre()
    const items = [makeFake.build()]
    const filterSpy = jest.spyOn(items, 'filter' as any)
    repository.items = items

    const itemsFiltered = await repository['applyFilter'](null)
    expect(filterSpy).not.toHaveBeenCalled()
    expect(items).toStrictEqual(itemsFiltered)
  })

  it('should filter items using categoryId filter parameter', async () => {
    const categoryId1 = new UniqueEntityId('1')
    const categoryId2 = new UniqueEntityId('2')

    const items = [
      GenreFakeBuilder.aGenre()
        .withName('foo')
        .withCategoryId(categoryId2)
        .withCategoryId(categoryId1)
        .build(),
      GenreFakeBuilder.aGenre()
        .withName('foo 2')
        .withCategoryId(categoryId2)
        .build(),
      GenreFakeBuilder.aGenre()
        .withName('foo 3')
        .withCategoryId(categoryId2)
        .build(),
      GenreFakeBuilder.aGenre()
        .withName('bar 2')
        .withCategoryId(categoryId2)
        .build(),
      GenreFakeBuilder.aGenre()
        .withName('bar 2')
        .withCategoryId(categoryId1)
        .build(),
    ]
    repository.items = items

    const itemsFiltered = await repository['applyFilter']({
      categoryId: categoryId1.value,
    })
    expect(itemsFiltered).toStrictEqual([items[0], items[4]])
  })

  it('should filter items using filter name parameter', async () => {
    const makeFake = GenreFakeBuilder.aGenre()

    const items = [
      makeFake.withName('foo').build(),
      makeFake.withName('foo 2').build(),
      makeFake.withName('foo 3').build(),
      makeFake.withName('bar 2').build(),
      makeFake.withName('bar 2').build(),
    ]
    repository.items = items

    const itemsFiltered = await repository['applyFilter']({
      name: 'foo',
    })
    expect(itemsFiltered).toStrictEqual([items[0], items[1], items[2]])
  })

  it('should filter items using filter isActive parameter', async () => {
    const makeFake = GenreFakeBuilder.aGenre()

    const items = [
      makeFake.withName('foo').activate().build(),
      makeFake.withName('foo 2').deactivate().build(),
      makeFake.withName('foo 3').activate().build(),
      makeFake.withName('bar 2').deactivate().build(),
      makeFake.withName('bar 2').deactivate().build(),
    ]
    repository.items = items

    const itemsFiltered = await repository['applyFilter']({
      is_active: false,
    })
    expect(itemsFiltered).toStrictEqual([items[1], items[3], items[4]])
  })
  it('should filter items using all filter parameters', async () => {
    const categoyId = new UniqueEntityId('1')
    const items = [
      GenreFakeBuilder.aGenre()
        .withCategoryId(categoyId)
        .withName('foo')
        .deactivate()
        .build(),
      GenreFakeBuilder.aGenre().withName('foo 2').deactivate().build(),
      GenreFakeBuilder.aGenre().withName('foo 3').activate().build(),
      GenreFakeBuilder.aGenre().withName('bar 2').deactivate().build(),
      GenreFakeBuilder.aGenre().withName('bar 2').deactivate().build(),
    ]
    repository.items = items

    const itemsFiltered = await repository['applyFilter']({
      categoryId: categoyId.value,
      name: 'foo',
      is_active: false,
    })
    expect(itemsFiltered.length).toBe(1)
    expect(itemsFiltered).toStrictEqual([items[0]])
  })
  it('should sort by created_at when sort param is null', async () => {
    const makeFakers = GenreFakeBuilder.theGenres(3)
    const items = makeFakers
      .withName((index) => 'index' + index)
      .withCreatedAt((index) => new Date(new Date().getTime() + index))
      .build()

    const itemsSorted = await repository['applySort'](items, null, null)
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]])
  })

  it('should sort by name', async () => {
    const makeFake = GenreFakeBuilder.aGenre()

    const items = [
      makeFake.withName('a').build(),
      makeFake.withName('b').build(),
      makeFake.withName('c').build(),
      makeFake.withName('d').build(),
    ]

    let itemsSorted = await repository['applySort'](items, 'name', 'desc')
    expect(itemsSorted).toStrictEqual([items[3], items[2], items[1], items[0]])

    itemsSorted = await repository['applySort'](items, 'name', 'asc')
    expect(itemsSorted).toStrictEqual([items[0], items[1], items[2], items[3]])
  })
})
