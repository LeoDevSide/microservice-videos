import { CastMemberFakeBuilder, CastMemberType } from '../../../../domain'
import { InMemoryCastMemberRepository } from '../../../../infra/repository/in-memory/in-memory-cast-member.repository'
import { FetchCastMembersUseCase } from '../../fetch-cast-member.usecase'

describe('FetchCastMembersUseCase Unit Tests', () => {
  let repository: InMemoryCastMemberRepository
  let useCase: FetchCastMembersUseCase
  beforeEach(() => {
    repository = new InMemoryCastMemberRepository()
    useCase = new FetchCastMembersUseCase(repository)
  })
  it('should fetch all CastMembers with null params', async () => {
    const makeFakers = CastMemberFakeBuilder.theCastMembers(5)
    const entities = makeFakers
      .withName((index) => 'index' + index)
      .withCreatedAt((index) => new Date(new Date().getTime() + index))
      .build()
    repository.items = entities

    const spyFindByIdRepoMethod = jest.spyOn(repository, 'search')
    const output = await useCase.execute({})

    expect(output.items).toStrictEqual([
      entities[4].toJSON(),
      entities[3].toJSON(),
      entities[2].toJSON(),
      entities[1].toJSON(),
      entities[0].toJSON(),
    ])
    expect(output.current_page).toEqual(1)
    expect(output.last_page).toEqual(1)
    expect(output.total).toEqual(5)

    expect(spyFindByIdRepoMethod).toHaveBeenCalledTimes(1)
  })

  it('should fetch all CastMembers with name params', async () => {
    const makeFake = CastMemberFakeBuilder.aCastMember()

    const entities = [
      makeFake.withName('foo').build(),
      makeFake.withName('foo 2').build(),
      makeFake.withName('foo 3').build(),
      makeFake.withName('bar 2').build(),
      makeFake.withName('bar 2').build(),
    ]
    repository.items = entities
    expect(repository.items.length).toBe(5)
    const spyFindByIdRepoMethod = jest.spyOn(repository, 'search')
    const output = await useCase.execute({
      filter: { name: 'foo' },
      sort: 'name',
      sort_dir: 'desc',
      per_page: 2,
      page: 1,
    })
    expect(output.items).toStrictEqual([
      entities[2].toJSON(),
      entities[1].toJSON(),
    ])
    expect(output.current_page).toEqual(1)
    expect(output.last_page).toEqual(2)
    expect(output.total).toEqual(3)

    expect(spyFindByIdRepoMethod).toHaveBeenCalledTimes(1)
  })
  it('should fetch all CastMembers with filter type params', async () => {
    const makeFake = CastMemberFakeBuilder.aCastMember()

    const entities = [
      makeFake.withName('foo 1').withType(CastMemberType.DIRECTOR).build(),
      makeFake.withName('foo 2').withType(CastMemberType.ACTOR).build(),
      makeFake.withName('foo 3').withType(CastMemberType.DIRECTOR).build(),
      makeFake.withName('foo 4').withType(CastMemberType.ACTOR).build(),
      makeFake.withName('foo 5').withType(CastMemberType.DIRECTOR).build(),
    ]
    repository.items = entities
    expect(repository.items.length).toBe(5)
    const spyFindByIdRepoMethod = jest.spyOn(repository, 'search')
    const output = await useCase.execute({
      filter: { type: CastMemberType.DIRECTOR },
      sort: 'name',
      sort_dir: 'asc',
      per_page: 4,
      page: 1,
    })
    expect(output).toStrictEqual({
      items: [entities[0].toJSON(), entities[2].toJSON(), entities[4].toJSON()],
      current_page: 1,
      last_page: 1,
      total: 3,
      per_page: 4,
    })

    expect(spyFindByIdRepoMethod).toHaveBeenCalledTimes(1)
  })
  it('should fetch all CastMembers with sort type params', async () => {
    const makeFake = CastMemberFakeBuilder.aCastMember()

    const entities = [
      makeFake.withName('foo 1').withType(CastMemberType.DIRECTOR).build(),
      makeFake.withName('foo 2').withType(CastMemberType.ACTOR).build(),
      makeFake.withName('foo 3').withType(CastMemberType.DIRECTOR).build(),
      makeFake.withName('foo 4').withType(CastMemberType.ACTOR).build(),
      makeFake.withName('foo 5').withType(CastMemberType.DIRECTOR).build(),
    ]
    repository.items = entities
    expect(repository.items.length).toBe(5)
    const spyFindByIdRepoMethod = jest.spyOn(repository, 'search')
    const output = await useCase.execute({
      sort: 'type',
      sort_dir: 'asc',
      per_page: 4,
      page: 1,
    })
    expect(output).toStrictEqual({
      items: [
        entities[0].toJSON(),
        entities[2].toJSON(),
        entities[4].toJSON(),
        entities[1].toJSON(),
      ],
      current_page: 1,
      last_page: 2,
      total: 5,
      per_page: 4,
    })

    expect(spyFindByIdRepoMethod).toHaveBeenCalledTimes(1)
  })

  it('should fetch all CastMembers with sort createdAt params', async () => {
    const makeFakers = CastMemberFakeBuilder.theCastMembers(3)
    const entities = makeFakers
      .withName((index) => 'index' + index)
      .withCreatedAt((index) => new Date(new Date().getTime() + index))
      .build()

    repository.items = entities
    expect(repository.items.length).toBe(3)

    const spyFindByIdRepoMethod = jest.spyOn(repository, 'search')
    const output = await useCase.execute({
      sort: 'created_at',
      sort_dir: 'asc',
      per_page: 2,
      page: 1,
    })
    expect(output).toStrictEqual({
      items: [entities[0].toJSON(), entities[1].toJSON()],
      current_page: 1,
      last_page: 2,
      total: 3,
      per_page: 2,
    })

    expect(spyFindByIdRepoMethod).toHaveBeenCalledTimes(1)
  })
})
