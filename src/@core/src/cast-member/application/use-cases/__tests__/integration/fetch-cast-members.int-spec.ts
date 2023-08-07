import { PrismaClient } from '@prisma/client'
import { CastMemberFakeBuilder, CastMemberType } from '../../../../domain'
import { PrismaCastMemberRepository } from '../../../../infra/repository/prisma/prisma-cast-member.repository'
import { FetchCastMembersUseCase } from '../../fetch-cast-member.usecase'

describe('FetchCastMembersUseCase Integration Tests', () => {
  const prisma = new PrismaClient()
  let repository: PrismaCastMemberRepository
  let useCase: FetchCastMembersUseCase
  beforeEach(async () => {
    repository = new PrismaCastMemberRepository(prisma)
    useCase = new FetchCastMembersUseCase(repository)
    await prisma.castMember.deleteMany()
  })
  it('should fetch all cast-members with null params', async () => {
    const entities = CastMemberFakeBuilder.theCastMembers(5)
      .withCreatedAt((index) => new Date(new Date().getTime() + index))
      .build()
    await repository.bulkInsert(entities)

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

  it('should fetch cast-members with pagination param', async () => {
    const entities = CastMemberFakeBuilder.theCastMembers(5)
      .withName((index) => 'index' + index)
      .build()
    await repository.bulkInsert(entities)
    const spyFindByIdRepoMethod = jest.spyOn(repository, 'search')
    const output = await useCase.execute({
      page: 2,
      per_page: 2,
    })

    expect(output.items.length).toBe(2)
    expect(output.current_page).toEqual(2)
    expect(output.last_page).toEqual(3)
    expect(output.total).toEqual(5)

    expect(spyFindByIdRepoMethod).toHaveBeenCalledTimes(1)
  })
  it('should fetch all cast-members with filter param', async () => {
    const entities = [
      CastMemberFakeBuilder.aCastMember()
        .withName('foo')
        .withCreatedAt(new Date(new Date().getTime() + 1))
        .withType(CastMemberType.ACTOR)
        .build(),
      CastMemberFakeBuilder.aCastMember()
        .withName('foo2')
        .withType(CastMemberType.DIRECTOR)
        .build(),
      CastMemberFakeBuilder.aCastMember()
        .withName('foo 3')
        .withType(CastMemberType.ACTOR)
        .withCreatedAt(new Date(new Date().getTime() + 2))
        .build(),
      CastMemberFakeBuilder.aCastMember()
        .withName('bar')
        .withType(CastMemberType.ACTOR)
        .build(),
      CastMemberFakeBuilder.aCastMember()
        .withName('bar2')
        .withType(CastMemberType.DIRECTOR)
        .build(),
    ]
    await repository.bulkInsert(entities)
    const spyFindByIdRepoMethod = jest.spyOn(repository, 'search')
    const output = await useCase.execute({
      filter: { name: 'foo', type: CastMemberType.ACTOR },
      page: 1,
      per_page: 2,
    })

    expect(output.items).toStrictEqual([
      entities[2].toJSON(),
      entities[0].toJSON(),
    ])
    expect(output.current_page).toEqual(1)
    expect(output.last_page).toEqual(1)
    expect(output.total).toEqual(2)

    expect(spyFindByIdRepoMethod).toHaveBeenCalledTimes(1)
  })

  it('should fetch cast-members with sort param', async () => {
    const entities = CastMemberFakeBuilder.theCastMembers(3)
      .withName((index) => 'index' + index)
      .build()
    await repository.bulkInsert(entities)
    const spyFindByIdRepoMethod = jest.spyOn(repository, 'search')
    const output = await useCase.execute({
      sort: 'name',
      sort_dir: 'desc',
      page: 1,
      per_page: 2,
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
})
