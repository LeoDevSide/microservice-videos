import { PrismaClient } from '@prisma/client'
import { NotFoundError, UniqueEntityId } from '../../../../../@shared/domain'
import { GenreFakeBuilder } from '../../../../domain'
import { GetGenreUseCase } from '../../get-genre.usecase'
import { PrismaGenreRepository } from '../../../../infra/repository/prisma/prisma-genre.repository'
import { CategoryFakeBuilder } from '../../../../../category/domain'

describe('GetGenreUseCase Unit Tests', () => {
  const prisma = new PrismaClient()
  let repository: PrismaGenreRepository
  let useCase: GetGenreUseCase

  const category = CategoryFakeBuilder.aCategory().build()
  const categoryId = category.id
  beforeAll(async () => {
    await prisma.category.create({ data: { ...category.toJSON() } })
  })
  beforeEach(async () => {
    await prisma.genreOnCategories.deleteMany()
    await prisma.genre.deleteMany()

    repository = new PrismaGenreRepository(prisma)
    useCase = new GetGenreUseCase(repository)
  })
  it('should find an genre with valid id', async () => {
    const entity = GenreFakeBuilder.aGenre()
      .withCategoryId(new UniqueEntityId(categoryId))
      .build()
    await repository.insert(entity)

    const spyFindByIdRepoMethod = jest.spyOn(repository, 'findById')
    const output = await useCase.execute({ id: entity.id })

    expect(output).toStrictEqual({
      id: entity.id,
      created_at: entity.createdAt,
      name: entity.name,
      is_active: entity.isActive,
      categories_id: [categoryId],
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
