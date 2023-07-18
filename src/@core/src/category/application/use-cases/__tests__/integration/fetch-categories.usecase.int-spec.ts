import { PrismaClient } from '@prisma/client'
import { CategoryEntity } from '../../../../domain'
import { FetchCategoriesUseCase } from '../../fetch-categories.usecase'
import { PrismaCategoryRepository } from '../../../../infra/repository/prisma/prisma-category.repository'

describe('FetchCategoriesUseCase Integration Tests', () => {
  const prisma = new PrismaClient()
  let repository: PrismaCategoryRepository
  let useCase: FetchCategoriesUseCase
  beforeEach(async () => {
    repository = new PrismaCategoryRepository(prisma)
    useCase = new FetchCategoriesUseCase(repository)
    await prisma.category.deleteMany()
  })
  it('should fetch all categories with null params', async () => {
    const now = new Date().getTime()
    const entities = [
      new CategoryEntity({
        name: 'test',
        createdAt: new Date(now + 100),
      }),
      new CategoryEntity({ name: 'test 2', createdAt: new Date(now + 200) }),
      new CategoryEntity({ name: 'test 3', createdAt: new Date(now + 300) }),
      new CategoryEntity({
        name: 'searchingThisString',
        createdAt: new Date(now + 400),
      }),
      new CategoryEntity({
        name: 'searchingThisString',
        createdAt: new Date(now + 500),
      }),
    ]
    for (const e of entities) {
      await repository.insert(e)
    }

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

  it('should fetch all categories with filter param', async () => {
    const now = new Date().getTime()
    const entities = [
      new CategoryEntity({
        name: 'test',
        createdAt: new Date(now + 100),
      }),
      new CategoryEntity({ name: 'test 2', createdAt: new Date(now + 200) }),
      new CategoryEntity({ name: 'test 3', createdAt: new Date(now + 300) }),
      new CategoryEntity({
        name: 'searchingThisString',
        createdAt: new Date(now + 500),
      }),
      new CategoryEntity({
        name: 'searchingThisString',
        createdAt: new Date(now + 400),
      }),
    ]
    for (const e of entities) {
      await repository.insert(e)
    }
    const spyFindByIdRepoMethod = jest.spyOn(repository, 'search')
    const output = await useCase.execute({
      filter: 'searchingThisString',
      page: 1,
      per_page: 2,
      sort: 'created_at',
      sort_dir: 'asc',
    })

    expect(output.items).toStrictEqual([
      entities[4].toJSON(),
      entities[3].toJSON(),
    ])
    expect(output.current_page).toEqual(1)
    expect(output.last_page).toEqual(1)
    expect(output.total).toEqual(2)

    expect(spyFindByIdRepoMethod).toHaveBeenCalledTimes(1)
  })
})
