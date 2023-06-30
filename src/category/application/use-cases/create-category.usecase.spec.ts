import { InMemoryCategoryRepository } from '../../infra/repository/category-in-memory.repository'
import { CreateCategoryUseCase } from './create-category.usecase'

describe('CreateCategoryUseCase Unit Tests', () => {
  let repository: InMemoryCategoryRepository
  let useCase: CreateCategoryUseCase
  beforeEach(() => {
    repository = new InMemoryCategoryRepository()
    useCase = new CreateCategoryUseCase(repository)
  })
  it('should create a new category', async () => {
    const spyInsertRepoMethod = jest.spyOn(repository, 'insert')
    const output = await useCase.execute({ name: 'test' })

    expect(repository.items.length).toBe(1)
    expect(output).toStrictEqual({
      id: repository.items[0].id,
      created_at: repository.items[0].createdAt,
      name: 'test',
      is_active: true,
      description: null,
    })
    expect(spyInsertRepoMethod).toHaveBeenCalledTimes(1)
  })

  it('should create a new category using optional inputs ', async () => {
    const spyInsertRepoMethod = jest.spyOn(repository, 'insert')

    const output = await useCase.execute({
      name: 'test',
      description: 'test description',
      isActive: false,
    })

    expect(repository.items.length).toBe(1)
    expect(output).toStrictEqual({
      id: repository.items[0].id,
      created_at: repository.items[0].createdAt,
      name: 'test',
      is_active: false,
      description: 'test description',
    })
    expect(spyInsertRepoMethod).toHaveBeenCalledTimes(1)
  })
})
