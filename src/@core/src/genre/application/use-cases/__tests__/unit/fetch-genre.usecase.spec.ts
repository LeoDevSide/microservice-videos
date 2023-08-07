import { UniqueEntityId } from '../../../../../@shared/domain'
import { GenreFakeBuilder } from '../../../../domain'
import { InMemoryGenreRepository } from '../../../../infra/repository/in-memory/in-memory-genre.repository'
import { FetchGenresUseCase } from '../../fetch-genres.usecase'

describe('FetchGenresUseCase Unit Tests', () => {
  let repository: InMemoryGenreRepository
  let useCase: FetchGenresUseCase
  beforeEach(() => {
    repository = new InMemoryGenreRepository()
    useCase = new FetchGenresUseCase(repository)
  })
  it('should fetch all Genres with null params', async () => {
    const makeFakers = GenreFakeBuilder.theGenres(5)
    const entities = makeFakers
      .withName((index) => 'index' + index)
      .withCreatedAt((index) => new Date(new Date().getTime() + index))
      .build()
    repository.items = entities

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

  it('should fetch all Genres with name params', async () => {
    const makeFake = GenreFakeBuilder.aGenre()

    const entities = [
      makeFake.withName('foo').build(),
      makeFake.withName('foo 2').build(),
      makeFake.withName('foo 3').build(),
      makeFake.withName('bar 2').build(),
      makeFake.withName('bar 2').build(),
    ]
    repository.items = entities
    expect(repository.items.length).toBe(5)
    const spyFindByIdRepoMethod = jest.spyOn(repository, 'search')
    const output = await useCase.execute({
      filter: { name: 'foo' },
      sort: 'name',
      sort_dir: 'desc',
      per_page: 2,
      page: 1,
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
  it('should fetch all Genres with filter categoryId params', async () => {
    const categoryId1 = new UniqueEntityId('1')
    const categoryId2 = new UniqueEntityId('2')

    const entities = [
      GenreFakeBuilder.aGenre()
        .withName('foo 1')
        .withCategoryId(categoryId1)
        .build(),
      GenreFakeBuilder.aGenre()
        .withName('foo 2')
        .withCategoryId(categoryId1)
        .build(),
      GenreFakeBuilder.aGenre()
        .withName('foo 3')
        .withCategoryId(categoryId1)
        .build(),
      GenreFakeBuilder.aGenre()
        .withName('foo 4')
        .withCategoryId(categoryId2)
        .build(),
      GenreFakeBuilder.aGenre()
        .withName('foo 5')
        .withCategoryId(categoryId2)
        .build(),
    ]
    repository.items = entities
    expect(repository.items.length).toBe(5)
    const spyFindByIdRepoMethod = jest.spyOn(repository, 'search')
    const output = await useCase.execute({
      filter: { categoryId: '1' },
      sort: 'name',
      sort_dir: 'asc',
      per_page: 4,
      page: 1,
    })
    expect(output).toStrictEqual({
      items: [entities[0].toJSON(), entities[1].toJSON(), entities[2].toJSON()],
      current_page: 1,
      last_page: 1,
      total: 3,
      per_page: 4,
    })

    expect(spyFindByIdRepoMethod).toHaveBeenCalledTimes(1)
  })

  it('should fetch all Genres with sort createdAt params', async () => {
    const makeFakers = GenreFakeBuilder.theGenres(3)
    const entities = makeFakers
      .withName((index) => 'index' + index)
      .withCreatedAt((index) => new Date(new Date().getTime() + index))
      .build()

    repository.items = entities
    expect(repository.items.length).toBe(3)

    const spyFindByIdRepoMethod = jest.spyOn(repository, 'search')
    const output = await useCase.execute({
      sort: 'created_at',
      sort_dir: 'asc',
      per_page: 2,
      page: 1,
    })
    expect(output).toStrictEqual({
      items: [entities[0].toJSON(), entities[1].toJSON()],
      current_page: 1,
      last_page: 2,
      total: 3,
      per_page: 2,
    })

    expect(spyFindByIdRepoMethod).toHaveBeenCalledTimes(1)
  })
})
