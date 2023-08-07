import { Test } from '@nestjs/testing'
import { GenresController } from '../../genres.controller'
import { DatabaseModule } from '../../../database/database.module'
import { GenresModule } from '../../genres.module'
import {
  CreateGenreUseCase,
  FetchGenresUseCase,
  GetGenreUseCase,
  UpdateGenreUseCase,
  DeleteGenreUseCase,
} from '@me/micro-videos/src/genre/application'
import { CreateGenreDto } from '../../dto/create-genre.dto'
import { IGenreRepository } from '@me/micro-videos/src/genre/infra'
import { GENRE_PROVIDERS } from '../../genres.providers'
import { UpdateGenreDto } from '../../dto/update-genre.dto'
import {
  GenreFakeBuilder,
  GenreJsonProps,
} from '@me/micro-videos/src/genre/domain'
import { SearchGenresDTO } from '../../dto/search-genres.dto'
import { PrismaService } from '../../../database/prisma/prisma.service'
import {
  GenreCollectionPresenter,
  GenrePresenter,
} from '../../presenter/genres.presenter'
import { CategoryFakeBuilder } from '@me/micro-videos/src/category/domain'
import { UniqueEntityId } from '@me/micro-videos/src/@shared/domain'

describe('GenresController Integration Tests', () => {
  let controller: GenresController
  let repository: IGenreRepository
  const db: PrismaService = new PrismaService()

  const category = CategoryFakeBuilder.aCategory().build()
  const categoryId = category.id

  const category2 = CategoryFakeBuilder.aCategory().build()
  const categoryId2 = category2.id

  beforeAll(async () => {
    await db.category.createMany({
      data: [{ ...category.toJSON() }, { ...category2.toJSON() }],
    })
  })
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [DatabaseModule, GenresModule],
    }).compile()

    controller = module.get<GenresController>(GenresController)
    repository = module.get(
      GENRE_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
    )
    await db.genreOnCategories.deleteMany()
    await db.genre.deleteMany()
  })
  it('Should be defined', () => {
    expect(controller).toBeDefined()
    expect(controller['createGenreUseCase']).toBeInstanceOf(CreateGenreUseCase)
    expect(controller['fetchGenresUseCase']).toBeInstanceOf(FetchGenresUseCase)
    expect(controller['getGenreUseCase']).toBeInstanceOf(GetGenreUseCase)
    expect(controller['updateGenreUseCase']).toBeInstanceOf(UpdateGenreUseCase)
    expect(controller['deleteGenreUseCase']).toBeInstanceOf(DeleteGenreUseCase)
    expect(controller['create'])
  })

  it('should create a genre', async () => {
    const input: CreateGenreDto = {
      name: 'test',
      categories_id: [categoryId],
    }

    const presenter = await controller.create(input)
    expect(presenter).toBeInstanceOf(GenrePresenter)
    const expectedPresenter: GenrePresenter = {
      name: input.name,
      categories_id: input.categories_id,
      created_at: expect.any(Date),
      id: expect.any(String),
      is_active: true,
    }
    expect({ ...presenter }).toStrictEqual(expectedPresenter)

    const entityFromDb = await repository.findById(presenter.id)
    const expectedOnDb: GenreJsonProps = {
      categories_id: input.categories_id,
      name: input.name,
      created_at: presenter.created_at,
      id: presenter.id,
      is_active: presenter.is_active,
    }
    expect(entityFromDb.toJSON()).toStrictEqual(expectedOnDb)
  })

  it('should update a genre', async () => {
    const input: UpdateGenreDto = {
      name: 'updated name',
      categories_id: [categoryId, categoryId2],
      is_active: false,
    }
    const entity = GenreFakeBuilder.aGenre()
      .withCategoryId(new UniqueEntityId(categoryId))
      .build()
    await repository.insert(entity)
    const createdOnDb = await repository.findAll()
    expect(createdOnDb.length).toBe(1)
    expect(createdOnDb[0].categoriesId.size).toBe(1)

    const presenter = await controller.update(entity.id, input)
    expect(presenter).toBeInstanceOf(GenrePresenter)
    const expectedPresenter: GenrePresenter = {
      name: input.name,
      categories_id: input.categories_id,
      created_at: expect.any(Date),
      id: expect.any(String),
      is_active: input.is_active,
    }
    expect({ ...presenter }).toStrictEqual(expectedPresenter)

    const entityFromDb = await repository.findById(presenter.id)
    const expectedOnDb: GenreJsonProps = {
      categories_id: input.categories_id,
      name: input.name,
      created_at: presenter.created_at,
      id: presenter.id,
      is_active: input.is_active,
    }
    expect(entityFromDb.toJSON()).toStrictEqual(expectedOnDb)
  })
  describe('search method', () => {
    it('should fetch genres using query empty sorted by created_at', async () => {
      const genres = GenreFakeBuilder.theGenres(4)
        .withName((index) => index + 'name')
        .withCreatedAt((index) => new Date(new Date().getTime() + index))
        .withCategoryId(new UniqueEntityId(categoryId))
        .build()
      for (const genre of genres) {
        await repository.insert(genre)
      }

      const arrange: { sendData: SearchGenresDTO; expected: any }[] = [
        {
          sendData: {},
          expected: new GenreCollectionPresenter({
            items: [
              genres[3].toJSON(),
              genres[2].toJSON(),
              genres[1].toJSON(),
              genres[0].toJSON(),
            ],
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 4,
          }),
        },
        {
          sendData: { per_page: 2, page: 1 },
          expected: new GenreCollectionPresenter({
            items: [genres[3].toJSON(), genres[2].toJSON()],
            current_page: 1,
            last_page: 2,
            per_page: 2,
            total: 4,
          }),
        },
      ]
      for (const item of arrange) {
        const presenter = await controller.search(item.sendData)
        expect(presenter).toStrictEqual(item.expected)
      }
    })
    it('should fetch genres using query with filter name', async () => {
      const genres = GenreFakeBuilder.theGenres(4)
        .withName((index) => index + 'name')
        .withCreatedAt((index) => new Date(new Date().getTime() + index))
        .withCategoryId(new UniqueEntityId(categoryId))
        .build()
      for (const genre of genres) {
        await repository.insert(genre)
      }

      const arrange: { sendData: SearchGenresDTO; expected: any }[] = [
        {
          sendData: {
            page: 1,
            per_page: 2,
            filter: { name: '2' },
          },
          expected: new GenreCollectionPresenter({
            items: [genres[2].toJSON()],
            current_page: 1,
            last_page: 1,
            per_page: 2,
            total: 1,
          }),
        },
        {
          sendData: {
            page: 1,
            per_page: 2,
            filter: { name: 'name' },
          },
          expected: new GenreCollectionPresenter({
            items: [genres[3].toJSON(), genres[2].toJSON()],
            current_page: 1,
            last_page: 2,
            per_page: 2,
            total: 4,
          }),
        },
      ]
      for (const item of arrange) {
        const presenter = await controller.search(item.sendData)
        expect(presenter).toStrictEqual(item.expected)
      }
    })

    it('should fetch genres using query with filter', async () => {
      const genres = [
        GenreFakeBuilder.aGenre()
          .withName('name 0')
          .withCategoryId(new UniqueEntityId(categoryId))
          .build(),
        GenreFakeBuilder.aGenre()
          .withName('name 1')
          .withCategoryId(new UniqueEntityId(categoryId2))
          .build(),
        GenreFakeBuilder.aGenre()
          .withName('name 2')
          .withCategoryId(new UniqueEntityId(categoryId2))
          .build(),
        GenreFakeBuilder.aGenre()
          .withName('name 3')
          .withCategoryId(new UniqueEntityId(categoryId2))
          .withCategoryId(new UniqueEntityId(categoryId))
          .build(),
        GenreFakeBuilder.aGenre()
          .withName('name 4')
          .withCategoryId(new UniqueEntityId(categoryId))
          .build(),
      ]
      for (const genre of genres) {
        await repository.insert(genre)
      }

      const arrange: { sendData: SearchGenresDTO; expected: any }[] = [
        {
          sendData: {
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: { categoryId },
          },
          expected: new GenreCollectionPresenter({
            items: [genres[0].toJSON(), genres[3].toJSON()],
            current_page: 1,
            last_page: 2,
            per_page: 2,
            total: 3,
          }),
        },
        {
          sendData: {
            page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
            filter: { categoryId },
          },
          expected: new GenreCollectionPresenter({
            items: [genres[0].toJSON()],
            current_page: 2,
            last_page: 2,
            per_page: 2,
            total: 3,
          }),
        },
      ]
      for (const item of arrange) {
        const presenter = await controller.search(item.sendData)
        expect(presenter).toStrictEqual(item.expected)
      }
    })

    it('should fetch genres using query with sort props', async () => {
      const genre = GenreFakeBuilder.aGenre()
      const genres = [
        genre
          .withName('a1')
          .withCategoryId(new UniqueEntityId(categoryId))
          .build(),
        genre
          .withName('a2')
          .withCategoryId(new UniqueEntityId(categoryId))
          .build(),
        genre
          .withName('a3')
          .withCategoryId(new UniqueEntityId(categoryId))
          .build(),
        genre
          .withName('a4')
          .withCategoryId(new UniqueEntityId(categoryId))
          .build(),
        genre
          .withName('a5')
          .withCategoryId(new UniqueEntityId(categoryId))
          .build(),
      ]
      for (const genre of genres) {
        await repository.insert(genre)
      }
      const arrange: { sendData: SearchGenresDTO; expected: any }[] = [
        {
          sendData: {
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
          },
          expected: new GenreCollectionPresenter({
            items: [genres[4].toJSON(), genres[3].toJSON()],
            current_page: 1,
            last_page: 3,
            per_page: 2,
            total: 5,
          }),
        },
        {
          sendData: {
            page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
          },
          expected: new GenreCollectionPresenter({
            items: [genres[2].toJSON(), genres[3].toJSON()],
            current_page: 2,
            last_page: 3,
            per_page: 2,
            total: 5,
          }),
        },
      ]
      for (const item of arrange) {
        const presenter = await controller.search(item.sendData)
        expect(presenter).toStrictEqual(item.expected)
      }
    })
  })

  it('should get a genre', async () => {
    const entity = GenreFakeBuilder.aGenre()
      .withCategoryId(new UniqueEntityId(categoryId))
      .build()
    const input = entity.id
    await repository.insert(entity)

    const presenter = await controller.findOne(input)
    const expectedPresenter: GenrePresenter = {
      name: entity.name,
      categories_id: [categoryId],
      created_at: entity.createdAt,
      id: expect.any(String),
      is_active: entity.isActive,
    }
    expect(presenter).toBeInstanceOf(GenrePresenter)
    expect({ ...presenter }).toStrictEqual(expectedPresenter)
  })
})
