/* eslint-disable dot-notation */
import { PrismaClient } from '@prisma/client'
import { PrismaCastMemberRepository } from './prisma-cast-member.repository'
import { CastMemberFakeBuilder, CastMemberType } from '../../../domain'
import { NotFoundError } from '../../../../@shared/domain'
import { CastMemberSearchParams } from '../cast-member.repository'
import { CastMemberMapper } from './cast-member.mapper'
describe('PrismaCastMemberRepository Integration Tests', () => {
  const prisma = new PrismaClient()
  let repository: PrismaCastMemberRepository
  beforeEach(async () => {
    repository = new PrismaCastMemberRepository(prisma)
    await prisma.castMember.deleteMany()
  })
  it('should be able to create a CastMember', async () => {
    const entity = CastMemberFakeBuilder.aCastMember().build()
    await repository.insert(entity)
    const castMember = await prisma.castMember.findUnique({
      where: { id: entity.id },
    })

    expect(castMember).toBeDefined()
    expect(castMember).toEqual({
      name: entity.name,
      created_at: entity.createdAt,
      id: entity.id,
      type: CastMemberMapper._toTypePropModel(entity.type),
    })
  })

  it('should be able to find a created CastMember', async () => {
    const entity = CastMemberFakeBuilder.aCastMember().build()
    await prisma.castMember.create({
      data: CastMemberMapper.toModel(entity),
    })
    const castMember = await repository.findById(entity.id)
    expect(castMember).toBeDefined()

    expect(castMember.toJSON()).toStrictEqual(entity.toJSON())
  })
  it('should be able to update a created CastMember', async () => {
    const entity = CastMemberFakeBuilder.aCastMember().build()
    await prisma.castMember.create({
      data: CastMemberMapper.toModel(entity),
    })
    entity.update({ name: 'updated foo', type: CastMemberType.ACTOR })
    await repository.update(entity)
    const castMemberUpdated = await prisma.castMember.findUnique({
      where: { id: entity.id },
    })
    expect(castMemberUpdated).toBeDefined()
    expect(castMemberUpdated).toStrictEqual(CastMemberMapper.toModel(entity))
    expect(castMemberUpdated.name).toEqual('updated foo')
    expect(castMemberUpdated.type).toEqual(
      CastMemberMapper._toTypePropModel(CastMemberType.ACTOR),
    )
  })

  it('should be able to delete a created CastMember', async () => {
    const entity = CastMemberFakeBuilder.aCastMember().build()
    await prisma.castMember.create({
      data: CastMemberMapper.toModel(entity),
    })

    await repository.delete(entity.id)

    const castMemberDeleted = await prisma.castMember.findUnique({
      where: { id: entity.id },
    })
    expect(castMemberDeleted).toBeFalsy()
  })

  it('should be able to get an CastMember by id with private method', async () => {
    const entity = CastMemberFakeBuilder.aCastMember().build()
    await prisma.castMember.create({
      data: CastMemberMapper.toModel(entity),
    })

    const foundCastMember = await repository['_getOrThrow'](entity.id)

    expect(foundCastMember.toJSON()).toEqual(entity.toJSON())
  })

  it('should be able to find all castMembers', async () => {
    const entities = CastMemberFakeBuilder.theCastMembers(4).build()
    await prisma.castMember.createMany({
      data: entities.map((member) => CastMemberMapper.toModel(member)),
    })

    const foundCastMembers = await repository.findAll()

    expect(foundCastMembers.length).toEqual(4)
    expect(foundCastMembers.map((member) => member.toJSON())).toStrictEqual(
      entities.map((member) => member.toJSON()),
    )
  })

  it('should be able to fetch castMembers with search params null', async () => {
    const entities = CastMemberFakeBuilder.theCastMembers(4)
      .withCreatedAt((index) => new Date(new Date().getTime() + index))
      .build()
    await prisma.castMember.createMany({
      data: entities.map((entity) => CastMemberMapper.toModel(entity)),
    })

    const searchParams = new CastMemberSearchParams({})
    const foundCastMembers = await repository.search(searchParams)

    expect(foundCastMembers.items.length).toEqual(4)
    expect(foundCastMembers.total).toEqual(4)
    expect(foundCastMembers.items[0].toJSON()).toEqual(entities[3].toJSON())
  })
  it('should be able to fetch castMembers with sortDir defined search params', async () => {
    const entities = CastMemberFakeBuilder.theCastMembers(4)
      .withCreatedAt((index) => new Date(new Date().getTime() + index))
      .build()
    await prisma.castMember.createMany({
      data: entities.map((entity) => CastMemberMapper.toModel(entity)),
    })
    const searchParams = new CastMemberSearchParams({
      sort: 'created_at',
      sortDir: 'asc',
    })
    const foundCastMembers = await repository.search(searchParams)

    expect(foundCastMembers.items.length).toEqual(4)
    expect(foundCastMembers.total).toEqual(4)
    expect(foundCastMembers.items[0].toJSON()).toEqual(entities[0].toJSON())
  })

  it('should be able to fetch castMembers with pagination defined search params', async () => {
    const entities = CastMemberFakeBuilder.theCastMembers(5).build()
    await prisma.castMember.createMany({
      data: entities.map((entity) => CastMemberMapper.toModel(entity)),
    })

    let searchParams = new CastMemberSearchParams({
      page: 1,
      perPage: 2,
    })
    let foundCastMembers = await repository.search(searchParams)

    expect(foundCastMembers.items.length).toEqual(2)
    expect(foundCastMembers.total).toEqual(5)
    expect(foundCastMembers.currentPage).toEqual(1)
    expect(foundCastMembers.lastPage).toEqual(3)

    searchParams = new CastMemberSearchParams({ page: 3, perPage: 2 })
    foundCastMembers = await repository.search(searchParams)
    expect(foundCastMembers.items.length).toEqual(1)
    expect(foundCastMembers.total).toEqual(5)
    expect(foundCastMembers.currentPage).toEqual(3)
    expect(foundCastMembers.lastPage).toEqual(3)
  })

  it('should be able to fetch castMembers with filter defined search params', async () => {
    const entities = [
      CastMemberFakeBuilder.aCastMember()
        .withName('foo')
        .withType(CastMemberType.ACTOR)
        .build(),
      CastMemberFakeBuilder.aCastMember()
        .withName('foo 2')
        .withType(CastMemberType.ACTOR)
        .build(),
      CastMemberFakeBuilder.aCastMember()
        .withName('foo 3')
        .withType(CastMemberType.DIRECTOR)
        .build(),
      CastMemberFakeBuilder.aCastMember()
        .withName('bar 2')
        .withType(CastMemberType.ACTOR)
        .build(),
      CastMemberFakeBuilder.aCastMember()
        .withName('bar 2')
        .withType(CastMemberType.DIRECTOR)
        .build(),
    ]
    await prisma.castMember.createMany({
      data: entities.map((entity) => CastMemberMapper.toModel(entity)),
    })
    let searchParams = new CastMemberSearchParams({
      page: 1,
      perPage: 4,
      filter: { name: 'foo', type: CastMemberType.ACTOR },
    })
    let foundCastMembers = await repository.search(searchParams)
    expect(foundCastMembers.items.length).toEqual(2)
    expect(foundCastMembers.total).toEqual(2)

    searchParams = new CastMemberSearchParams({
      page: 1,
      perPage: 4,
      filter: { name: 'bar' },
    })
    foundCastMembers = await repository.search(searchParams)
    expect(foundCastMembers.items.length).toEqual(2)
    expect(foundCastMembers.total).toEqual(2)

    searchParams = new CastMemberSearchParams({
      page: 1,
      perPage: 4,
      filter: { type: CastMemberType.ACTOR },
    })
    foundCastMembers = await repository.search(searchParams)
    expect(foundCastMembers.items.length).toEqual(3)
    expect(foundCastMembers.total).toEqual(3)
  })

  it('should throw not found error when cant get an CastMember by id with private method', async () => {
    const entity = CastMemberFakeBuilder.aCastMember().build()
    await prisma.castMember.create({
      data: CastMemberMapper.toModel(entity),
    })
    expect(async () => {
      await repository['_getOrThrow']('inexistent-id')
    }).rejects.toThrow(NotFoundError)
  })
})
