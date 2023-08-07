import { NotFoundError } from '../../../../../@shared/domain'
import { GenreFakeBuilder } from '../../../../domain'
import { InMemoryGenreRepository } from '../../../../infra/repository/in-memory/in-memory-genre.repository'
import { GetGenreUseCase } from '../../get-genre.usecase'

describe('GetGenreUseCase Unit Tests', () => {
  let repository: InMemoryGenreRepository
  let useCase: GetGenreUseCase
  beforeEach(() => {
    repository = new InMemoryGenreRepository()
    useCase = new GetGenreUseCase(repository)
  })
  it('should find an genre with valid id', async () => {
    const fakeGenre = GenreFakeBuilder.aGenre().build()
    await repository.insert(fakeGenre)

    const spyFindByIdRepoMethod = jest.spyOn(repository, 'findById')
    const output = await useCase.execute({ id: fakeGenre.id })
    expect(output).toStrictEqual({
      id: fakeGenre.id,
      created_at: fakeGenre.createdAt,
      name: fakeGenre.name,
      is_active: true,
      categories_id: [...fakeGenre.categoriesId.keys()],
    })
    expect(spyFindByIdRepoMethod).toHaveBeenCalledTimes(1)
  })

  it('should throws an error when not found an genre with inexistent id ', async () => {
    const spyFindByIdRepoMethod = jest.spyOn(repository, 'findById')

    expect(async () => {
      await useCase.execute({ id: 'someInexistentId' })
    }).rejects.toThrow(NotFoundError)
    expect(spyFindByIdRepoMethod).toHaveBeenCalledTimes(1)
  })
})
