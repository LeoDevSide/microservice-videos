import { NotFoundError } from '../../../../../@shared/domain'
import { CategoryEntity } from '../../../../domain'
import { InMemoryCategoryRepository } from '../../../../infra/repository/in-memory'
import { UpdateCategoryUsecase } from '../../update-category.usecase'

describe('UpdateCategoryUseCase Unit Tests', () => {
  let repository: InMemoryCategoryRepository
  let useCase: UpdateCategoryUsecase
  beforeEach(() => {
    repository = new InMemoryCategoryRepository()
    useCase = new UpdateCategoryUsecase(repository)
  })
  it('should update an existent category', async () => {
    const categoryEntity = new CategoryEntity({ name: 'test' })
    await repository.insert(categoryEntity)
    const spyMethod = jest.spyOn(repository, 'update')

    const input = {
      id: categoryEntity.id,
      description: 'updated description',
      name: 'updated name',
      is_active: false,
    }

    const output = await useCase.execute(input)

    expect(output.name).toBe('updated name')
    expect(output.description).toBe('updated description')
    expect(output.id).toBe(categoryEntity.id)
    expect(output.is_active).toBe(false)
    expect(output.created_at).toBeTruthy()

    expect(spyMethod).toHaveBeenCalledTimes(1)
  })

  it('should not update an not found category and throws a error', async () => {
    const categoryEntity = new CategoryEntity({ name: 'test' })
    await repository.insert(categoryEntity)
    const spyMethod = jest.spyOn(repository, 'update')

    const input = {
      id: 'inexistent',
      description: 'updated description',
      name: 'updated name',
      is_active: false,
    }

    expect(async () => {
      await useCase.execute(input)
    }).rejects.toThrow(NotFoundError)

    expect(spyMethod).toHaveBeenCalledTimes(0)
  })
})
