import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from '../../src/app.module'
import { GENRE_PROVIDERS } from '../../src/genres/genres.providers'
import { applyGlobalConfig } from '../../src/global-config'
import { IGenreRepository } from '@me/micro-videos/src/genre/infra'
import { GenreFakeBuilder } from '@me/micro-videos/src/genre/domain'
import { PrismaService } from '../../src/database/prisma/prisma.service'
import { UniqueEntityId } from '@me/micro-videos/src/@shared/domain'
import { CategoryFakeBuilder } from '@me/micro-videos/src/category/domain'
import { PrismaCategoryRepository } from '@me/micro-videos/src/category/infra'

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
  beforeAll(async () => {
    const db = new PrismaService()
    const categoryRepo = new PrismaCategoryRepository(db)
    await categoryRepo.bulkInsert([category])
  })
  describe('GET /genres/:id', () => {
    it('should response error when throws id not found error', async () => {
      const { app } = await startApp()
      const res = await request(app.getHttpServer())
        .get('/genres/10609771-fae7-4779-b336-56e2cdda737f')
        .send()

      expect(res.statusCode).toBe(404)
      expect(res.body['message']).toStrictEqual(
        'Genre 10609771-fae7-4779-b336-56e2cdda737f not found in db',
      )
      expect(res.body['error']).toStrictEqual('Not Found')
      expect(res.body['statusCode']).toStrictEqual(404)
    })

    it('should response error 422 when id param in url is not an UUID', async () => {
      const { app } = await startApp()
      const res = await request(app.getHttpServer())
        .get('/genres/invalidid')
        .send()

      expect(res.statusCode).toBe(422)
      expect(res.body['message']).toStrictEqual(
        'Validation failed (uuid is expected)',
      )
      expect(res.body['error']).toStrictEqual('Unprocessable Entity')
      expect(res.body['statusCode']).toStrictEqual(422)
    })

    it('should get a genre', async () => {
      const { app } = await startApp()
      const repo: IGenreRepository = app.get(
        GENRE_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
      )
      const fakeGenre = GenreFakeBuilder.aGenre()
        .withCategoryId(new UniqueEntityId(category.id))
        .build()
      await repo.insert(fakeGenre)

      const response = await request(app.getHttpServer())
        .get(`/genres/${fakeGenre.id}`)
        .send()
      expect(response.statusCode).toBe(200)
      expect(Object.keys(response.body.data)).toEqual([
        'id',
        'name',
        'is_active',
        'categories_id',
        'created_at',
      ])

      const genreFromRepo = await repo.findById(response.body.data['id'])

      expect(response.body).toEqual({
        data: {
          id: genreFromRepo.id,
          name: genreFromRepo.name,
          is_active: genreFromRepo.isActive,
          categories_id: [category.id],
          created_at: genreFromRepo.createdAt.toISOString(),
        },
      })
    })
  })
})
