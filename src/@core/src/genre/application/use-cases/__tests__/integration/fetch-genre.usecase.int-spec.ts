import { PrismaClient } from '@prisma/client'
import { GenreFakeBuilder } from '../../../../domain'
import { PrismaGenreRepository } from '../../../../infra/repository/prisma/prisma-genre.repository'
import { FetchGenresUseCase } from '../../fetch-genres.usecase'
import { CategoryFakeBuilder } from '../../../../../category/domain'
import { UniqueEntityId } from '../../../../../@shared/domain'

describe('FetchGenresUseCase Integration Tests', () => {
  const prisma = new PrismaClient()
  let repository: PrismaGenreRepository
  let useCase: FetchGenresUseCase
  const category = CategoryFakeBuilder.aCategory().build()
  const category2 = CategoryFakeBuilder.aCategory().build()
  const categoryId = new UniqueEntityId(category.id)
  const categoryId2 = new UniqueEntityId(category2.id)

  beforeAll(async () => {
    await prisma.category.create({ data: { ...category.toJSON() } })
    await prisma.category.create({ data: { ...category2.toJSON() } })
  })
  beforeEach(async () => {
    await prisma.genreOnCategories.deleteMany()
    await prisma.genre.deleteMany()

    repository = new PrismaGenreRepository(prisma)
    useCase = new FetchGenresUseCase(repository)
  })
  it('should fetch all cast-members with null params', async () => {
    const entities = GenreFakeBuilder.theGenres(5)
      .withCreatedAt((index) => new Date(new Date().getTime() + index))
      .withCategoryId(categoryId)
      .build()
    for (const entity of entities) {
      await repository.insert(entity)
    }
    const persisted = await prisma.genre.findMany()
    expect(persisted).toHaveLength(5)
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
    const entities = GenreFakeBuilder.theGenres(5)
      .withName((index) => 'index' + index)
      .withCategoryId(categoryId)
      .build()
    for (const entity of entities) {
      await repository.insert(entity)
    }
    const persisted = await prisma.genre.findMany()
    expect(persisted).toHaveLength(5)

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
      GenreFakeBuilder.aGenre()
        .withName('foo')
        .withCategoryId(categoryId)
        .withCreatedAt(new Date(new Date().getTime() + 1))
        .build(),
      GenreFakeBuilder.aGenre()
        .withName('foo2')
        .withCategoryId(categoryId2)
        .build(),
      GenreFakeBuilder.aGenre()
        .withName('foo 3')
        .withCreatedAt(new Date(new Date().getTime() + 2))
        .withCategoryId(categoryId)
        .build(),
      GenreFakeBuilder.aGenre()
        .withName('bar')
        .withCategoryId(categoryId)
        .build(),
      GenreFakeBuilder.aGenre()
        .withName('bar2')
        .withCategoryId(categoryId2)
        .build(),
    ]
    for (const entity of entities) {
      await repository.insert(entity)
    }
    const persisted = await prisma.genre.findMany()
    expect(persisted).toHaveLength(5)

    const spyFindByIdRepoMethod = jest.spyOn(repository, 'search')
    const output = await useCase.execute({
      filter: { name: 'foo', categoryId: categoryId.value },
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
    const entities = GenreFakeBuilder.theGenres(3)
      .withName((index) => 'index' + index)
      .withCategoryId(categoryId)
      .build()
    for (const entity of entities) {
      await repository.insert(entity)
    }
    const persisted = await prisma.genre.findMany()
    expect(persisted).toHaveLength(3)
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
