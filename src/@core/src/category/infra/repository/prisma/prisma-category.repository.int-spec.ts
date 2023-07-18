/* eslint-disable dot-notation */
import { PrismaClient } from '@prisma/client'
import { PrismaCategoryRepository } from './prisma-category.repository'
import { CategoryEntity } from '../../../domain'
import { NotFoundError } from '../../../../@shared/domain'
import { CategorySearchParams } from '../category.repository'
describe('PrismaCategoryRepository Integration Tests', () => {
  const prisma = new PrismaClient()
  let repository: PrismaCategoryRepository
  beforeEach(async () => {
    repository = new PrismaCategoryRepository(prisma)
    await prisma.category.deleteMany()
  })
  it('should be able to create a Category', async () => {
    const entity = new CategoryEntity({ name: 'test' })
    await repository.insert(entity)
    const category = await prisma.category.findUnique({
      where: { id: entity.id },
    })
    expect(category).toBeDefined()
    expect(category).toEqual({
      name: entity.name,
      description: entity.description,
      created_at: entity.createdAt,
      is_active: entity.isActive,
      id: entity.id,
    })
  })
  it('should be able to find a created Category', async () => {
    const entity = new CategoryEntity({ name: 'test2' })
    await prisma.category.create({
      data: { ...entity.toJSON() },
    })
    const category = await repository.findById(entity.id)
    expect(category).toBeDefined()

    expect(category.toJSON()).toStrictEqual(entity.toJSON())
  })
  it('should be able to update a created Category', async () => {
    const entity = new CategoryEntity({ name: 'test3' })
    await prisma.category.create({
      data: { ...entity.toJSON() },
    })
    entity.update({ description: 'updated description', name: 'test4' })
    await repository.update(entity)
    const categoryUpdated = await prisma.category.findUnique({
      where: { id: entity.id },
    })
    expect(categoryUpdated).toBeDefined()
    expect(categoryUpdated).toStrictEqual(entity.toJSON())
    expect(categoryUpdated.name).not.toEqual('test3')
  })

  it('should be able to delete a created Category', async () => {
    const entity = new CategoryEntity({ name: 'test4' })
    await prisma.category.create({
      data: { ...entity.toJSON() },
    })
    await repository.delete(entity.id)

    const categoryDeleted = await prisma.category.findUnique({
      where: { id: entity.id },
    })
    expect(categoryDeleted).toBeFalsy()
  })
  it('should be able to get an Category by id with private method', async () => {
    const entity = new CategoryEntity({ name: 'test5' })
    await prisma.category.create({
      data: { ...entity.toJSON() },
    })
    const foundCategory = await repository['_getOrThrow'](entity.id)

    expect(foundCategory.toJSON()).toEqual(entity.toJSON())
  })

  it('should be able to find all categories', async () => {
    const entity = new CategoryEntity({ name: 'test' })
    await prisma.category.create({
      data: { ...entity.toJSON() },
    })
    const foundCategories = await repository.findAll()

    expect(foundCategories.length).toEqual(1)
    expect(foundCategories[0].toJSON()).toEqual(entity.toJSON())
  })

  it('should be able to fetch categories with search params null', async () => {
    const lowDate = new Date()
    const midDate = new Date(lowDate.getTime() + 500)
    const highDate = new Date(lowDate.getTime() + 1000)
    const entities = [
      new CategoryEntity({ name: 'test', createdAt: lowDate }),
      new CategoryEntity({ name: 'search some string', createdAt: lowDate }),
      new CategoryEntity({ name: 'string to search', createdAt: lowDate }),
      new CategoryEntity({ name: 'string searchable', createdAt: lowDate }),
      new CategoryEntity({ name: 'string searchable', createdAt: midDate }),
      new CategoryEntity({ name: 'string searchable', createdAt: highDate }),
    ]
    for (const ent of entities) {
      await prisma.category.create({ data: { ...ent.toJSON() } })
    }
    const searchParams = new CategorySearchParams({})
    const foundCategories = await repository.search(searchParams)

    expect(foundCategories.items.length).toEqual(6)
    expect(foundCategories.total).toEqual(6)
    expect(foundCategories.items[0].toJSON()).toEqual(entities[5].toJSON())
  })
  it('should be able to fetch categories with sortDir defined search params', async () => {
    const lowDate = new Date()
    const midDate = new Date(lowDate.getTime() + 500)
    const highDate = new Date(lowDate.getTime() + 1000)
    const entities = [
      new CategoryEntity({ name: 'search some string', createdAt: lowDate }),
      new CategoryEntity({
        name: 'test',
        createdAt: new Date(lowDate.getTime() - 50),
      }),
      new CategoryEntity({ name: 'string to search', createdAt: lowDate }),
      new CategoryEntity({ name: 'string searchable', createdAt: lowDate }),
      new CategoryEntity({ name: 'string searchable', createdAt: midDate }),
      new CategoryEntity({ name: 'string searchable', createdAt: highDate }),
    ]
    for (const ent of entities) {
      await prisma.category.create({ data: { ...ent.toJSON() } })
    }
    const searchParams = new CategorySearchParams({
      sort: 'created_at',
      sortDir: 'asc',
    })
    const foundCategories = await repository.search(searchParams)

    expect(foundCategories.items.length).toEqual(6)
    expect(foundCategories.total).toEqual(6)
    expect(foundCategories.items[0].toJSON()).toEqual(entities[1].toJSON())
  })

  it('should be able to fetch categories with pagination defined search params', async () => {
    const entities = []
    for (let i = 0; i < 20; i++) {
      entities.push(new CategoryEntity({ name: 'test' }))
    }
    for (const ent of entities) {
      await prisma.category.create({ data: { ...ent.toJSON() } })
    }
    let searchParams = new CategorySearchParams({
      page: 1,
      perPage: 6,
    })
    let foundCategories = await repository.search(searchParams)

    expect(foundCategories.items.length).toEqual(6)
    expect(foundCategories.total).toEqual(20)
    expect(foundCategories.currentPage).toEqual(1)

    searchParams = new CategorySearchParams({ page: 4, perPage: 6 })
    foundCategories = await repository.search(searchParams)
    expect(foundCategories.items.length).toEqual(2)
    expect(foundCategories.total).toEqual(20)
    expect(foundCategories.currentPage).toEqual(4)
    expect(foundCategories.lastPage).toEqual(4)
  })

  it('should be able to fetch categories with filter defined search params', async () => {
    const entities = []
    for (let i = 0; i < 10; i++) {
      entities.push(new CategoryEntity({ name: 'test' }))
      entities.push(new CategoryEntity({ name: 'search this' }))
      entities.push(new CategoryEntity({ name: 'searching this' }))
    }
    for (const ent of entities) {
      await prisma.category.create({ data: { ...ent.toJSON() } })
    }
    const searchParams = new CategorySearchParams({
      page: 1,
      perPage: 11,
      filter: 'search',
    })
    const foundCategories = await repository.search(searchParams)

    expect(foundCategories.items.length).toEqual(11)
    expect(foundCategories.total).toEqual(20)
  })

  it('should throw not found error when cant get an Category by id with private method', async () => {
    const entity = new CategoryEntity({ name: 'test6' })
    await prisma.category.create({
      data: { ...entity.toJSON() },
    })
    expect(async () => {
      await repository['_getOrThrow']('inexistent-id')
    }).rejects.toThrow(NotFoundError)
  })
})
