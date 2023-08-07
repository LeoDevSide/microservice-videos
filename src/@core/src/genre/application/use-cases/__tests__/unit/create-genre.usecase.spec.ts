import { UniqueEntityId } from '../../../../../@shared/domain'
import { InMemoryGenreRepository } from '../../../../infra/repository/in-memory/in-memory-genre.repository'
import { CreateGenreUseCase } from '../../create-genre.usecase'

describe('CreateGenreUseCase Unit Tests', () => {
  let repository: InMemoryGenreRepository
  let useCase: CreateGenreUseCase
  beforeEach(() => {
    repository = new InMemoryGenreRepository()
    useCase = new CreateGenreUseCase(repository)
  })
  it('should create a new genre', async () => {
    const spyInsertRepoMethod = jest.spyOn(repository, 'insert')
    const output = await useCase.execute({
      name: 'test',
      categories_id: ['1'],
    })

    expect(repository.items.length).toBe(1)
    expect(output).toStrictEqual({
      id: repository.items[0].id,
      created_at: repository.items[0].createdAt,
      name: 'test',
      is_active: true,
      categories_id: ['1'],
    })
    expect(repository.items[0].categoriesId.has('1')).toBeTruthy()
    expect(repository.items[0].categoriesId.get('1')).toBeInstanceOf(
      UniqueEntityId,
    )

    expect(spyInsertRepoMethod).toHaveBeenCalledTimes(1)
  })
})
