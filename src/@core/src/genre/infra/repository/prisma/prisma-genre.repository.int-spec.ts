/* eslint-disable dot-notation */
import { PrismaClient } from '@prisma/client'
import { PrismaGenreRepository } from './prisma-genre.repository'
import { GenreFakeBuilder } from '../../../domain'
import { NotFoundError, UniqueEntityId } from '../../../../@shared/domain'
import { GenreSearchParams } from '../genre.repository'
import { GenreMapper } from './genre.mapper'
import { CategoryFakeBuilder } from '../../../../category/domain'
import { PrismaCategoryRepository } from '../../../../category/infra'
describe('PrismaGenreRepository Integration Tests', () => {
  const prisma = new PrismaClient()
  let repository: PrismaGenreRepository
  let categoryRepo: PrismaCategoryRepository

  let categoryId: UniqueEntityId
  let categoryId2: UniqueEntityId
  const categoryEntity = CategoryFakeBuilder.aCategory().build()
  const categoryEntity2 = CategoryFakeBuilder.aCategory().build()

  beforeAll(async () => {
    categoryId = new UniqueEntityId(categoryEntity.id)
    categoryId2 = new UniqueEntityId(categoryEntity2.id)
  })
  beforeEach(async () => {
    repository = new PrismaGenreRepository(prisma)
    categoryRepo = new PrismaCategoryRepository(prisma)
    await prisma.genreOnCategories.deleteMany()
    await prisma.category.deleteMany()
    await prisma.genre.deleteMany()
    await categoryRepo.bulkInsert([categoryEntity, categoryEntity2])
  })

  it('should be able to get an Genre by id with private method', async () => {
    const categoryEntity = CategoryFakeBuilder.aCategory().build()
    await categoryRepo.insert(categoryEntity)
    const categoryId = new UniqueEntityId(categoryEntity.id)

    const entity = GenreFakeBuilder.aGenre().withCategoryId(categoryId).build()
    await prisma.genre.create(GenreMapper.toCreateModel(entity))

    const foundGenre = await repository['_getOrThrow'](entity.id)

    expect(foundGenre.toJSON()).toEqual(entity.toJSON())
  })

  it('should be able to create a Genre', async () => {
    const entity = GenreFakeBuilder.aGenre().withCategoryId(categoryId).build()
    await repository.insert(entity)
    const genre = await prisma.genre.findUnique({
      where: { id: entity.id },
      include: { categories: true },
    })
    expect(genre).toBeDefined()
    expect(genre).toStrictEqual({
      name: entity.name,
      created_at: entity.createdAt,
      id: entity.id,
      is_active: true,
      categories: expect.any(Array),
    })
    expect(genre.categories[0].category_id).toBe(categoryId.value)
  })

  it('should be able to find a created Genre', async () => {
    const categoryEntity = CategoryFakeBuilder.aCategory().build()
    await categoryRepo.insert(categoryEntity)
    const categoryId = new UniqueEntityId(categoryEntity.id)

    const entity = GenreFakeBuilder.aGenre().withCategoryId(categoryId).build()
    await prisma.genre.create(GenreMapper.toCreateModel(entity))

    const genre = await repository.findById(entity.id)
    expect(genre).toBeDefined()

    expect(genre.toJSON()).toStrictEqual(entity.toJSON())
  })
  it('should be able to update a created Genre', async () => {
    const entity = GenreFakeBuilder.aGenre().withCategoryId(categoryId).build()
    await prisma.genre.create(GenreMapper.toCreateModel(entity))
    const persisted = await prisma.genre.findMany({
      include: { categories: true },
    })
    expect(persisted.length).toBe(1)
    expect(persisted[0].categories.length).toBe(1)
    entity.update({ name: 'updated name' })
    entity.deactivate()
    entity.addCategoryId(categoryId2)
    await repository.update(entity)

    const genreUpdated = await prisma.genre.findUnique({
      where: { id: entity.id },
      include: { categories: true },
    })
    expect(genreUpdated).toBeDefined()
    expect(genreUpdated).toStrictEqual({
      name: 'updated name',
      created_at: entity.createdAt,
      id: entity.id,
      is_active: false,
      categories: expect.any(Array),
    })

    expect(genreUpdated.categories.length).toBe(2)
    expect(
      genreUpdated.categories.find((c) => c.category_id === categoryId.value),
    ).toBeTruthy()
    expect(
      genreUpdated.categories.find((c) => c.category_id === categoryId2.value),
    ).toBeTruthy()
  })

  it('should be able to delete a created Genre and relations', async () => {
    const categoryEntity = CategoryFakeBuilder.aCategory().build()
    await categoryRepo.insert(categoryEntity)
    const categoryId = new UniqueEntityId(categoryEntity.id)

    const entity = GenreFakeBuilder.aGenre().withCategoryId(categoryId).build()
    await prisma.genre.create(GenreMapper.toCreateModel(entity))
    let persisted = await prisma.genre.findMany()
    expect(persisted.length).toBe(1)

    await repository.delete(entity.id)

    persisted = await prisma.genre.findMany()
    const deletedRelations = await prisma.genreOnCategories.findMany({
      where: { genre_id: entity.id },
    })
    expect(deletedRelations.length).toBe(0)
    expect(persisted.length).toBe(0)
  })

  it('should be able to find all genres', async () => {
    const categoryEntity = CategoryFakeBuilder.aCategory().build()
    await categoryRepo.insert(categoryEntity)
    const categoryId = new UniqueEntityId(categoryEntity.id)

    const entity = GenreFakeBuilder.aGenre().withCategoryId(categoryId).build()
    const entity2 = GenreFakeBuilder.aGenre().withCategoryId(categoryId).build()
    const entities = [entity, entity2]
    await prisma.genre.create(GenreMapper.toCreateModel(entity))
    await prisma.genre.create(GenreMapper.toCreateModel(entity2))

    const persisted = await prisma.genre.findMany()
    expect(persisted.length).toBe(2)

    const foundGenres = await repository.findAll()

    expect(foundGenres.length).toEqual(2)
    expect(foundGenres.map((member) => member.toJSON())).toStrictEqual(
      entities.map((member) => member.toJSON()),
    )
  })

  it('should be able to fetch genres with search params default', async () => {
    const categoryEntity = CategoryFakeBuilder.aCategory().build()
    await categoryRepo.insert(categoryEntity)
    const categoryId = new UniqueEntityId(categoryEntity.id)

    const entities = GenreFakeBuilder.theGenres(4)
      .withCreatedAt((index) => new Date(new Date().getTime() + index))
      .withCategoryId(categoryId)
      .build()
    for (const entity of entities) {
      await prisma.genre.create(GenreMapper.toCreateModel(entity))
    }
    const persisted = await prisma.genre.findMany()
    expect(persisted.length).toBe(4)

    const searchParams = new GenreSearchParams({})
    const foundGenres = await repository.search(searchParams)

    expect(foundGenres.items.length).toEqual(4)
    expect(foundGenres.total).toEqual(4)
    expect(foundGenres.items[0].toJSON()).toEqual(entities[3].toJSON())
  })
  it('should be able to fetch genres with sortDir defined search params', async () => {
    const categoryEntity = CategoryFakeBuilder.aCategory().build()
    await categoryRepo.insert(categoryEntity)
    const categoryId = new UniqueEntityId(categoryEntity.id)

    const entities = GenreFakeBuilder.theGenres(4)
      .withCreatedAt((index) => new Date(new Date().getTime() + index))
      .withCategoryId(categoryId)
      .build()
    for (const entity of entities) {
      await prisma.genre.create(GenreMapper.toCreateModel(entity))
    }
    const persisted = await prisma.genre.findMany()
    expect(persisted.length).toBe(4)

    const searchParams = new GenreSearchParams({
      sort: 'created_at',
      sortDir: 'asc',
    })
    const foundGenres = await repository.search(searchParams)

    expect(foundGenres.items.length).toEqual(4)
    expect(foundGenres.total).toEqual(4)
    expect(foundGenres.items[0].toJSON()).toEqual(entities[0].toJSON())
  })

  it('should be able to fetch genres with pagination defined search params', async () => {
    const categoryEntity = CategoryFakeBuilder.aCategory().build()
    await categoryRepo.insert(categoryEntity)
    const categoryId = new UniqueEntityId(categoryEntity.id)

    const entities = GenreFakeBuilder.theGenres(5)
      .withCategoryId(categoryId)
      .build()
    for (const entity of entities) {
      await prisma.genre.create(GenreMapper.toCreateModel(entity))
    }
    const persisted = await prisma.genre.findMany()
    expect(persisted.length).toBe(5)

    let searchParams = new GenreSearchParams({
      page: 1,
      perPage: 2,
    })
    let foundGenres = await repository.search(searchParams)

    expect(foundGenres.items.length).toEqual(2)
    expect(foundGenres.total).toEqual(5)
    expect(foundGenres.currentPage).toEqual(1)
    expect(foundGenres.lastPage).toEqual(3)

    searchParams = new GenreSearchParams({ page: 3, perPage: 2 })
    foundGenres = await repository.search(searchParams)
    expect(foundGenres.items.length).toEqual(1)
    expect(foundGenres.total).toEqual(5)
    expect(foundGenres.currentPage).toEqual(3)
    expect(foundGenres.lastPage).toEqual(3)
  })

  it('should be able to fetch genres with filter defined search params', async () => {
    const categoryEntity1 = CategoryFakeBuilder.aCategory().build()
    const categoryEntity2 = CategoryFakeBuilder.aCategory().build()

    await categoryRepo.bulkInsert([categoryEntity1, categoryEntity2])

    const categoryId1 = new UniqueEntityId(categoryEntity1.id)
    const categoryId2 = new UniqueEntityId(categoryEntity2.id)

    const entities = [
      GenreFakeBuilder.aGenre()
        .withName('foo')
        .withCategoryId(categoryId1)
        .activate()
        .build(),
      GenreFakeBuilder.aGenre()
        .withName('foo 2')
        .withCategoryId(categoryId2)
        .activate()
        .build(),
      GenreFakeBuilder.aGenre()
        .withName('foo 3')
        .withCategoryId(categoryId2)
        .withCategoryId(categoryId1)
        .activate()
        .build(),
      GenreFakeBuilder.aGenre()
        .withName('bar 2')
        .withCategoryId(categoryId2)
        .activate()
        .build(),
      GenreFakeBuilder.aGenre()
        .withName('bar 2')
        .withCategoryId(categoryId2)
        .deactivate()
        .build(),
    ]
    for (const entity of entities) {
      await prisma.genre.create(GenreMapper.toCreateModel(entity))
    }

    let searchParams = new GenreSearchParams({
      page: 1,
      perPage: 4,
      filter: { name: 'foo', categoryId: categoryId2.value },
    })
    let foundGenres = await repository.search(searchParams)
    expect(foundGenres.items.length).toEqual(2)
    expect(foundGenres.total).toEqual(2)

    searchParams = new GenreSearchParams({
      page: 1,
      perPage: 4,
      filter: { name: 'bar' },
    })
    foundGenres = await repository.search(searchParams)
    expect(foundGenres.items.length).toEqual(2)
    expect(foundGenres.total).toEqual(2)

    searchParams = new GenreSearchParams({
      page: 1,
      perPage: 4,
      filter: { categoryId: categoryId2.value },
    })
    foundGenres = await repository.search(searchParams)
    expect(foundGenres.items.length).toEqual(4)
    expect(foundGenres.total).toEqual(4)

    searchParams = new GenreSearchParams({
      page: 1,
      perPage: 4,
      filter: { is_active: false },
    })
    foundGenres = await repository.search(searchParams)
    expect(foundGenres.items.length).toEqual(1)
    expect(foundGenres.total).toEqual(1)
  })

  it('should throw not found error when cant get an Genre by id with private method', async () => {
    expect(async () => {
      await repository['_getOrThrow']('inexistent-id')
    }).rejects.toThrow(NotFoundError)
  })
})
