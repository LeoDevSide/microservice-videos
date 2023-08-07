import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from '../../src/app.module'
import { GENRE_PROVIDERS } from '../../src/genres/genres.providers'
import { applyGlobalConfig } from '../../src/global-config'
import { IGenreRepository } from '@me/micro-videos/src/genre/infra'
import { GenreFakeBuilder } from '@me/micro-videos/src/genre/domain'
import { GenresController } from '../../src/genres/genres.controller'
import { instanceToPlain } from 'class-transformer'
import { PrismaService } from '../../src/database/prisma/prisma.service'
import qs from 'qs'
import { CategoryFakeBuilder } from '@me/micro-videos/src/category/domain'
import { PrismaCategoryRepository } from '@me/micro-videos/src/category/infra'
import { UniqueEntityId } from '@me/micro-videos/src/@shared/domain'

async function startApp({
  beforeInit,
}: {
  beforeInit?: (app: INestApplication) => void
} = {}) {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile()
  const _app: INestApplication = moduleFixture.createNestApplication()
  applyGlobalConfig(_app)
  beforeInit && beforeInit(_app)
  await _app.init()

  return {
    get app() {
      return _app
    },
  }
}
describe('GenresController (e2e)', () => {
  const category = CategoryFakeBuilder.aCategory().build()
  const category2 = CategoryFakeBuilder.aCategory().build()
  const db = new PrismaService()
  beforeAll(async () => {
    const categoryRepo = new PrismaCategoryRepository(db)
    await categoryRepo.bulkInsert([category, category2])
  })
  beforeEach(async () => {
    await db.genreOnCategories.deleteMany()
    await db.genre.deleteMany() // clear db
  })
  describe('GET /genres/?queryParams', () => {
    // it('should response error when throws id not found error', async () => {
    //   const { app } = await startApp()
    //   const res = await request(app.getHttpServer())
    //     .get('/genres/10609771-fae7-4779-b336-56e2cdda737f')
    //     .send()

    //   expect(res.statusCode).toBe(404)
    //   expect(res.body['message']).toStrictEqual(
    //     'Genre 10609771-fae7-4779-b336-56e2cdda737f not found in db',
    //   )
    //   expect(res.body['error']).toStrictEqual('Not Found')
    //   expect(res.body['statusCode']).toStrictEqual(404)
    // })

    // it('should response error 422 when id param in url is not an UUID', async () => {
    //   const { app } = await startApp()
    //   const res = await request(app.getHttpServer())
    //     .get('/genres/invalidid')
    //     .send()

    //   expect(res.statusCode).toBe(422)
    //   expect(res.body['message']).toStrictEqual(
    //     'Validation failed (uuid is expected)',
    //   )
    //   expect(res.body['error']).toStrictEqual('Unprocessable Entity')
    //   expect(res.body['statusCode']).toStrictEqual(422)
    // })

    it('should fetch genres without query param', async () => {
      const { app } = await startApp()
      const repo: IGenreRepository = app.get(
        GENRE_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
      )
      const fakeGenres = GenreFakeBuilder.theGenres(5)
        .withName((index) => 'name' + index)
        .withCreatedAt((index) => new Date(new Date().getTime() + index))
        .withCategoryId(new UniqueEntityId(category.id))
        .build()
      for (const genre of fakeGenres) {
        await repo.insert(genre)
      }
      const response = await request(app.getHttpServer()).get(`/genres/`).send()
      expect(response.statusCode).toBe(200)
      expect(Object.keys(response.body)).toEqual(['data', 'meta'])
      expect(Object.keys(response.body.meta)).toEqual([
        'current_page',
        'per_page',
        'last_page',
        'total',
      ])

      const toPresenter = fakeGenres.map((genre) =>
        instanceToPlain(GenresController.toResponse(genre.toJSON())),
      )
      const toExpected = [
        toPresenter[4],
        toPresenter[3],
        toPresenter[2],
        toPresenter[1],
        toPresenter[0],
      ]
      expect(response.body).toEqual({
        data: toExpected,
        meta: {
          current_page: 1,
          per_page: 15,
          last_page: 1,
          total: 5,
        },
      })
    })
    it('should fetch genres with query param', async () => {
      const { app } = await startApp()
      const repo: IGenreRepository = app.get(
        GENRE_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
      )

      const fakeGenres = GenreFakeBuilder.theGenres(5)
        .withName((index) => '' + index)
        .withCategoryId(new UniqueEntityId(category.id))
        .build()
      for (const genre of fakeGenres) {
        await repo.insert(genre)
      }
      const dto = {
        page: '2',
        per_page: '2',
        sort: 'name',
        sort_dir: 'desc',
      }
      const urlQuery = qs.stringify(dto)
      const response = await request(app.getHttpServer())
        .get(`/genres/?${urlQuery}`)
        .send()
      expect(response.statusCode).toBe(200)
      expect(Object.keys(response.body)).toEqual(['data', 'meta'])
      expect(Object.keys(response.body.meta)).toEqual([
        'current_page',
        'per_page',
        'last_page',
        'total',
      ])

      const toPresenter = fakeGenres.map((genre) =>
        instanceToPlain(GenresController.toResponse(genre.toJSON())),
      )
      const toExpected = [toPresenter[2], toPresenter[1]]
      expect(response.body).toEqual({
        data: toExpected,
        meta: {
          current_page: 2,
          per_page: 2,
          last_page: 3,
          total: 5,
        },
      })
    })
    it('should fetch genres with filter name query param', async () => {
      const { app } = await startApp()
      const repo: IGenreRepository = app.get(
        GENRE_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
      )

      const fakeGenres = GenreFakeBuilder.theGenres(5)
        .withCategoryId(new UniqueEntityId(category.id))
        .withName((index) => 'searchThis' + index)
        .build()
      const unserchableMember = GenreFakeBuilder.aGenre()
        .withCategoryId(new UniqueEntityId(category.id))
        .build()
      for (const genre of fakeGenres) {
        await repo.insert(genre)
      }
      await repo.insert(unserchableMember)

      const dto = {
        page: '2',
        per_page: '2',
        sort: 'name',
        sort_dir: 'desc',
        filter: { name: 'searchThis' },
      }
      const urlQuery = qs.stringify(dto)
      const response = await request(app.getHttpServer())
        .get(`/genres/?${urlQuery}`)
        .send()
      expect(response.statusCode).toBe(200)
      expect(Object.keys(response.body)).toEqual(['data', 'meta'])
      expect(Object.keys(response.body.meta)).toEqual([
        'current_page',
        'per_page',
        'last_page',
        'total',
      ])

      const toPresenter = fakeGenres.map((genre) =>
        instanceToPlain(GenresController.toResponse(genre.toJSON())),
      )
      const toExpected = [toPresenter[2], toPresenter[1]]
      expect(response.body).toEqual({
        data: toExpected,
        meta: {
          current_page: 2,
          per_page: 2,
          last_page: 3,
          total: 5,
        },
      })
    })
    it('should fetch genres with filter categoryId query param', async () => {
      const { app } = await startApp()
      const repo: IGenreRepository = app.get(
        GENRE_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
      )

      const fakeGenres = GenreFakeBuilder.theGenres(5)
        .withName((index) => '' + index)
        .withCategoryId(new UniqueEntityId(category.id))
        .build()
      const unserchableMember = GenreFakeBuilder.aGenre()
        .withCategoryId(new UniqueEntityId(category2.id))
        .build()
      for (const genre of fakeGenres) {
        await repo.insert(genre)
      }
      await repo.insert(unserchableMember)

      const dto = {
        page: '2',
        per_page: '2',
        sort: 'name',
        sort_dir: 'desc',
        filter: { categoryId: category.id },
      }
      const urlQuery = qs.stringify(dto)
      const response = await request(app.getHttpServer())
        .get(`/genres/?${urlQuery}`)
        .send()
      expect(response.statusCode).toBe(200)
      expect(Object.keys(response.body)).toEqual(['data', 'meta'])
      expect(Object.keys(response.body.meta)).toEqual([
        'current_page',
        'per_page',
        'last_page',
        'total',
      ])

      const toPresenter = fakeGenres.map((genre) =>
        instanceToPlain(GenresController.toResponse(genre.toJSON())),
      )
      const toExpected = [toPresenter[2], toPresenter[1]]
      expect(response.body).toEqual({
        data: toExpected,
        meta: {
          current_page: 2,
          per_page: 2,
          last_page: 3,
          total: 5,
        },
      })
    })

    it('should fetch genres with filter type & name query param', async () => {
      const { app } = await startApp()
      const repo: IGenreRepository = app.get(
        GENRE_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
      )

      const fakeGenres = GenreFakeBuilder.theGenres(5)
        .withName((index) => 'searchThis' + index)
        .withCategoryId(new UniqueEntityId(category.id))
        .build()
      const unserchableMembers = GenreFakeBuilder.theGenres(2)
        .withCategoryId(new UniqueEntityId(category2.id))
        .withCategoryId(new UniqueEntityId(category.id))
        .build()
      for (const genre of fakeGenres) {
        await repo.insert(genre)
      }
      for (const genre of unserchableMembers) {
        await repo.insert(genre)
      }
      const dto = {
        page: '2',
        per_page: '2',
        sort: 'name',
        sort_dir: 'desc',
        filter: { name: 'searchThis', categoryId: category.id },
      }
      const urlQuery = qs.stringify(dto)
      const response = await request(app.getHttpServer())
        .get(`/genres/?${urlQuery}`)
        .send()
      expect(response.statusCode).toBe(200)
      expect(Object.keys(response.body)).toEqual(['data', 'meta'])
      expect(Object.keys(response.body.meta)).toEqual([
        'current_page',
        'per_page',
        'last_page',
        'total',
      ])

      const toPresenter = fakeGenres.map((genre) =>
        instanceToPlain(GenresController.toResponse(genre.toJSON())),
      )
      const toExpected = [toPresenter[2], toPresenter[1]]
      expect(response.body).toEqual({
        data: toExpected,
        meta: {
          current_page: 2,
          per_page: 2,
          last_page: 3,
          total: 5,
        },
      })
    })
  })
})
