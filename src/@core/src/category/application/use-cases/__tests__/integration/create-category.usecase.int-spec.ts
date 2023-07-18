import { PrismaClient } from '@prisma/client'
import { PrismaCategoryRepository } from '../../../../infra/repository/prisma/prisma-category.repository'
import {
  CreateCategoryInputDTO,
  CreateCategoryUseCase,
} from '../../create-category.usecase'

describe('CreateCategoryUseCase Integration Tests', () => {
  const prisma: PrismaClient = new PrismaClient()
  let repository: PrismaCategoryRepository
  let useCase: CreateCategoryUseCase
  beforeEach(async () => {
    repository = new PrismaCategoryRepository(prisma)
    useCase = new CreateCategoryUseCase(repository)
    await prisma.category.deleteMany()
  })
  afterAll(async () => prisma.$disconnect())
  it('should create a new category', async () => {
    const spyInsertRepoMethod = jest.spyOn(repository, 'insert')
    const input: CreateCategoryInputDTO = {
      name: 'test',
    }
    const output = await useCase.execute(input)
    const findAllDb = await prisma.category.findMany()
    expect(findAllDb.length).toBe(1)
    expect(output).toStrictEqual({
      id: findAllDb[0].id,
      created_at: findAllDb[0].created_at,
      name: 'test',
      is_active: true,
      description: null,
    })
    expect(spyInsertRepoMethod).toHaveBeenCalledTimes(1)
  })

  it('should create a new category using optional inputs ', async () => {
    const spyInsertRepoMethod = jest.spyOn(repository, 'insert')
    const input: CreateCategoryInputDTO = {
      name: 'test',
      description: 'test description',
      isActive: false,
    }
    const output = await useCase.execute(input)
    const findAllDb = await prisma.category.findMany()
    expect(findAllDb.length).toBe(1)
    expect(output).toStrictEqual({
      id: findAllDb[0].id,
      created_at: findAllDb[0].created_at,
      name: 'test',
      is_active: false,
      description: 'test description',
    })
    expect(spyInsertRepoMethod).toHaveBeenCalledTimes(1)
  })
})
