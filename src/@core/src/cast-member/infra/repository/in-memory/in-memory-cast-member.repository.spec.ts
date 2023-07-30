/* eslint-disable dot-notation */
import { CastMemberFakeBuilder, CastMemberType } from '../../../domain'
import { InMemoryCastMemberRepository } from './in-memory-cast-member.repository'

describe('CastMemberInMemoryRepository', () => {
  let repository: InMemoryCastMemberRepository

  beforeEach(() => (repository = new InMemoryCastMemberRepository()))
  it('should no filter items when filter object is null', async () => {
    const makeFake = CastMemberFakeBuilder.aCastMember()
    const items = [makeFake.build()]
    const filterSpy = jest.spyOn(items, 'filter' as any)
    repository.items = items

    const itemsFiltered = await repository['applyFilter'](null)
    expect(filterSpy).not.toHaveBeenCalled()
    expect(items).toStrictEqual(itemsFiltered)
  })

  it('should filter items using name & type filter parameter', async () => {
    const makeFake = CastMemberFakeBuilder.aCastMember()

    const items = [
      makeFake.withName('foo').withType(CastMemberType.ACTOR).build(),
      makeFake.withName('foo 2').withType(CastMemberType.ACTOR).build(),
      makeFake.withName('foo 3').withType(CastMemberType.DIRECTOR).build(),
      makeFake.withName('bar 2').withType(CastMemberType.ACTOR).build(),
      makeFake.withName('bar 2').withType(CastMemberType.DIRECTOR).build(),
    ]
    repository.items = items

    const filterSpy = jest.spyOn(items, 'filter' as any)

    const itemsFiltered = await repository['applyFilter']({
      name: 'foo',
      type: CastMemberType.ACTOR,
    })
    expect(filterSpy).toHaveBeenCalledTimes(1)
    expect(itemsFiltered).toStrictEqual([items[0], items[1]])
  })

  it('should filter items using filter name parameter', async () => {
    const makeFake = CastMemberFakeBuilder.aCastMember()

    const items = [
      makeFake.withName('foo').withType(CastMemberType.ACTOR).build(),
      makeFake.withName('foo 2').withType(CastMemberType.ACTOR).build(),
      makeFake.withName('foo 3').withType(CastMemberType.DIRECTOR).build(),
      makeFake.withName('bar 2').withType(CastMemberType.ACTOR).build(),
      makeFake.withName('bar 2').withType(CastMemberType.DIRECTOR).build(),
    ]
    repository.items = items

    const filterSpy = jest.spyOn(items, 'filter' as any)

    const itemsFiltered = await repository['applyFilter']({
      name: 'foo',
    })
    expect(filterSpy).toHaveBeenCalledTimes(1)
    expect(itemsFiltered).toStrictEqual([items[0], items[1], items[2]])
  })

  it('should filter items using filter type parameter', async () => {
    const makeFake = CastMemberFakeBuilder.aCastMember()

    const items = [
      makeFake.withName('foo').withType(CastMemberType.ACTOR).build(),
      makeFake.withName('foo 2').withType(CastMemberType.ACTOR).build(),
      makeFake.withName('foo 3').withType(CastMemberType.DIRECTOR).build(),
      makeFake.withName('bar 2').withType(CastMemberType.ACTOR).build(),
      makeFake.withName('bar 2').withType(CastMemberType.DIRECTOR).build(),
    ]
    repository.items = items
    const filterSpy = jest.spyOn(items, 'filter' as any)

    const itemsFiltered = await repository['applyFilter']({
      type: CastMemberType.DIRECTOR,
    })
    expect(filterSpy).toHaveBeenCalledTimes(1)
    expect(itemsFiltered).toStrictEqual([items[2], items[4]])
  })
  it('should sort by created_at when sort param is null', async () => {
    const makeFakers = CastMemberFakeBuilder.theCastMembers(3)
    const items = makeFakers
      .withName((index) => 'index' + index)
      .withCreatedAt((index) => new Date(new Date().getTime() + index))
      .build()

    const itemsSorted = await repository['applySort'](items, null, null)
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]])
  })

  it('should sort by name', async () => {
    const makeFake = CastMemberFakeBuilder.aCastMember()

    const items = [
      makeFake.withName('a').withType(CastMemberType.DIRECTOR).build(),
      makeFake.withName('b').withType(CastMemberType.ACTOR).build(),
      makeFake.withName('c').withType(CastMemberType.DIRECTOR).build(),
      makeFake.withName('d').withType(CastMemberType.ACTOR).build(),
    ]

    let itemsSorted = await repository['applySort'](items, 'name', 'desc')
    expect(itemsSorted).toStrictEqual([items[3], items[2], items[1], items[0]])

    itemsSorted = await repository['applySort'](items, 'name', 'asc')
    expect(itemsSorted).toStrictEqual([items[0], items[1], items[2], items[3]])
  })
  it('should sort by type', async () => {
    const makeFake = CastMemberFakeBuilder.aCastMember()

    const items = [
      makeFake.withName('a').withType(CastMemberType.DIRECTOR).build(),
      makeFake.withName('b').withType(CastMemberType.ACTOR).build(),
      makeFake.withName('c').withType(CastMemberType.DIRECTOR).build(),
      makeFake.withName('d').withType(CastMemberType.ACTOR).build(),
    ]

    let itemsSorted = await repository['applySort'](items, 'type', 'desc')
    expect(itemsSorted).toStrictEqual([items[1], items[3], items[0], items[2]])

    itemsSorted = await repository['applySort'](items, 'type', 'asc')
    expect(itemsSorted).toStrictEqual([items[0], items[2], items[1], items[3]])
  })
})
