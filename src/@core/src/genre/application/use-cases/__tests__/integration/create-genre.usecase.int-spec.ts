import { PrismaClient } from '@prisma/client'
import {
  CreateGenreInputDTO,
  CreateGenreUseCase,
} from '../../create-genre.usecase'
import { PrismaGenreRepository } from '../../../../infra/repository/prisma/prisma-genre.repository'
import { CategoryFakeBuilder } from '../../../../../category/domain'

describe('CreateGenreUseCase Integration Tests', () => {
  const prisma: PrismaClient = new PrismaClient()
  let repository: PrismaGenreRepository
  let useCase: CreateGenreUseCase

  const category = CategoryFakeBuilder.aCategory().build()
  const categoryId = category.id

  beforeAll(async () => {
    await prisma.category.create({ data: { ...category.toJSON() } })
  })
  beforeEach(async () => {
    await prisma.genreOnCategories.deleteMany()
    await prisma.genre.deleteMany()

    repository = new PrismaGenreRepository(prisma)
    useCase = new CreateGenreUseCase(repository)
  })

  afterAll(async () => prisma.$disconnect())

  it('should create a new genre', async () => {
    const spyInsertRepoMethod = jest.spyOn(repository, 'insert')
    const input: CreateGenreInputDTO = {
      name: 'test',
      categories_id: [categoryId],
    }

    const output = await useCase.execute(input)

    const findAllDb = await prisma.genre.findMany()
    expect(findAllDb.length).toBe(1)
    expect(output).toStrictEqual({
      id: findAllDb[0].id,
      created_at: findAllDb[0].created_at,
      name: 'test',
      is_active: true,
      categories_id: [categoryId],
    })
    expect(spyInsertRepoMethod).toHaveBeenCalledTimes(1)
  })

  it('should create a new genre using optional inputs ', async () => {
    const spyInsertRepoMethod = jest.spyOn(repository, 'insert')
    const input: CreateGenreInputDTO = {
      categories_id: [categoryId],
      name: 'test',
      is_active: false,
    }
    const output = await useCase.execute(input)
    const findAllDb = await prisma.genre.findMany()
    expect(findAllDb.length).toBe(1)
    expect(output).toStrictEqual({
      id: findAllDb[0].id,
      created_at: findAllDb[0].created_at,
      name: 'test',
      is_active: false,
      categories_id: [categoryId],
    })
    expect(spyInsertRepoMethod).toHaveBeenCalledTimes(1)
  })
})
