import { NotFoundError } from '../../../../../@shared/domain'
import { GenreFakeBuilder } from '../../../../domain'
import { InMemoryGenreRepository } from '../../../../infra/repository/in-memory/in-memory-genre.repository'
import { DeleteGenreUseCase } from '../../delete-genre.usecase'

describe('DeleteGenreUseCase Unit Tests', () => {
  let repository: InMemoryGenreRepository
  let useCase: DeleteGenreUseCase
  beforeEach(() => {
    repository = new InMemoryGenreRepository()
    useCase = new DeleteGenreUseCase(repository)
  })
  it('should delete an existent genre by id ', async () => {
    const fakeGenre = GenreFakeBuilder.aGenre().build()
    await repository.insert(fakeGenre)
    expect(repository.items.length).toBe(1)
    const spyDeleteRepoMethod = jest.spyOn(repository, 'delete')

    await useCase.execute({ id: fakeGenre.id })

    expect(repository.items.length).toBe(0)
    expect(spyDeleteRepoMethod).toHaveBeenCalledTimes(1)
  })

  it('should throws an error when not found an genre with inexistent id ', async () => {
    const spyDeleteRepoMethod = jest.spyOn(repository, 'findById')

    expect(async () => {
      await useCase.execute({ id: 'someInexistentId' })
    }).rejects.toThrow(NotFoundError)
    expect(spyDeleteRepoMethod).toHaveBeenCalledTimes(1)
  })
})
