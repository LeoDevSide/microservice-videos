import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from '../../src/app.module'
import { GENRE_PROVIDERS } from '../../src/genres/genres.providers'
import { applyGlobalConfig } from '../../src/global-config'
import { IGenreRepository } from '@me/micro-videos/src/genre/infra'
import { GenreFakeBuilder } from '@me/micro-videos/src/genre/domain'
import { CategoryFakeBuilder } from '@me/micro-videos/src/category/domain'
import { PrismaService } from '../../src/database/prisma/prisma.service'
import { PrismaCategoryRepository } from '@me/micro-videos/src/category/infra'
import { UpdateGenreDto } from '../../src/genres/dto/update-genre.dto'
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
  beforeAll(async () => {
    const db = new PrismaService()
    const categoryRepo = new PrismaCategoryRepository(db)
    await categoryRepo.bulkInsert([category, category2])
  })
  describe('PUT /genres', () => {
    it('should response error when throws id not found error', async () => {
      const { app } = await startApp()
      const input: UpdateGenreDto = {
        name: 'test',
        is_active: true,
        categories_id: [category.id],
      }
      const res = await request(app.getHttpServer())
        .put('/genres/10609771-fae7-4779-b336-56e2cdda737f')
        .send(input)

      expect(res.statusCode).toBe(404)
      expect(res.body['message']).toStrictEqual(
        'Genre 10609771-fae7-4779-b336-56e2cdda737f not found in db',
      )
      expect(res.body['error']).toStrictEqual('Not Found')
      expect(res.body['statusCode']).toStrictEqual(404)
    })
    it('should response error 422 if body is invalid', async () => {
      const { app } = await startApp()
      const res = await request(app.getHttpServer())
        .put('/genres/anyid')
        .send({ name: 2, categories_id: 2 })

      expect(res.statusCode).toBe(422)
      expect(res.body['message']).toStrictEqual([
        'name must be a string',
        'categories_id must be an array',
      ])
      expect(res.body['error']).toStrictEqual('Unprocessable Entity')
      expect(res.body['statusCode']).toStrictEqual(422)
    })

    it('should response error 422 when id param in url is not an UUID', async () => {
      const { app } = await startApp()
      const res = await request(app.getHttpServer())
        .put('/genres/invalidid')
        .send({ name: 'test' })

      expect(res.statusCode).toBe(422)
      expect(res.body['message']).toStrictEqual(
        'Validation failed (uuid is expected)',
      )
      expect(res.body['error']).toStrictEqual('Unprocessable Entity')
      expect(res.body['statusCode']).toStrictEqual(422)
    })

    it('should response error 422 when domain throws validation error', async () => {
      const { app } = await startApp({
        beforeInit: (app) => {
          app['config'].globalPipes = [] // this line disable validationPipe
        },
      })
      const fakeGenre = GenreFakeBuilder.aGenre()
        .withCategoryId(new UniqueEntityId(category.id))
        .build()
      const repo: IGenreRepository = app.get(
        GENRE_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
      )
      await repo.insert(fakeGenre)

      const res = await request(app.getHttpServer())
        .put(`/genres/${fakeGenre.id}`)
        .send({ name: 22 })

      expect(res.statusCode).toBe(422)
      expect(res.body['message']).toStrictEqual([
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ])
      expect(res.body['error']).toStrictEqual('Unprocessable Entity')
      expect(res.body['statusCode']).toStrictEqual(422)
    })

    it('should update a genre', async () => {
      const { app } = await startApp()
      const repo: IGenreRepository = app.get(
        GENRE_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
      )
      const fakeGenre = GenreFakeBuilder.aGenre()
        .withCategoryId(new UniqueEntityId(category.id))
        .build()
      await repo.insert(fakeGenre)

      const body: UpdateGenreDto = {
        name: 'updated name',
        is_active: false,
        categories_id: [category.id, category2.id],
      }
      const response = await request(app.getHttpServer())
        .put(`/genres/${fakeGenre.id}`)
        .send(body)

      expect(response.statusCode).toBe(200)
      expect(Object.keys(response.body.data)).toEqual([
        'id',
        'name',
        'is_active',
        'categories_id',
        'created_at',
      ])

      const genreUpdated = await repo.findById(response.body.data['id'])

      expect(response.body).toEqual({
        data: {
          id: genreUpdated.id,
          name: genreUpdated.name,
          is_active: false,
          categories_id: [category.id, category2.id],
          created_at: genreUpdated.createdAt.toISOString(),
        },
      })
    })
  })
})
