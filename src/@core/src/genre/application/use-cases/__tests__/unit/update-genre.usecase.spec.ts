import { NotFoundError } from '../../../../../@shared/domain'
import { GenreFakeBuilder } from '../../../../domain'
import { InMemoryGenreRepository } from '../../../../infra/repository/in-memory/in-memory-genre.repository'
import {
  UpdateGenreInputDTO,
  UpdateGenreUseCase,
} from '../../update-genre.usecase'

describe('UpdateGenreUseCase Unit Tests', () => {
  let repository: InMemoryGenreRepository
  let useCase: UpdateGenreUseCase
  beforeEach(() => {
    repository = new InMemoryGenreRepository()
    useCase = new UpdateGenreUseCase(repository)
  })
  it('should update an existent genre', async () => {
    const genreEntity = GenreFakeBuilder.aGenre().build()
    await repository.insert(genreEntity)
    const spyMethod = jest.spyOn(repository, 'update')
    expect(repository.items.length).toBe(1)

    const input: UpdateGenreInputDTO = {
      id: genreEntity.id,
      name: 'updated name',
      is_active: false,
      categories_id: ['1', '2'],
    }

    const output = await useCase.execute(input)

    expect(output.name).toBe('updated name')
    expect(output.id).toBe(genreEntity.id)
    expect(output.created_at).toBeTruthy()
    expect(output.is_active).toBeFalsy()
    expect(output.categories_id).toEqual(['1', '2'])
    expect(spyMethod).toHaveBeenCalledTimes(1)
  })

  it('should not update an not found genre and throws a error', async () => {
    const spyMethod = jest.spyOn(repository, 'update')

    const input = {
      id: 'inexistent',
      name: 'updated name',
    }

    expect(async () => {
      await useCase.execute(input)
    }).rejects.toThrow(NotFoundError)

    expect(spyMethod).toHaveBeenCalledTimes(0)
  })
})
