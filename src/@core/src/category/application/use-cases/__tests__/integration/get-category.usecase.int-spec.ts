import { PrismaClient } from '@prisma/client'
import { NotFoundError } from '../../../../../@shared/domain'
import { CategoryEntity } from '../../../../domain'
import { PrismaCategoryRepository } from '../../../../infra/repository/prisma/prisma-category.repository'
import { GetCategoryUseCase } from '../../get-category.usecase'

describe('GetCategoryUseCase Unit Tests', () => {
  const prisma = new PrismaClient()
  let repository: PrismaCategoryRepository
  let useCase: GetCategoryUseCase
  beforeEach(async () => {
    repository = new PrismaCategoryRepository(prisma)
    useCase = new GetCategoryUseCase(repository)
    await prisma.category.deleteMany()
  })
  it('should find an category with valid id', async () => {
    const entity = new CategoryEntity({ name: 'test' })
    await repository.insert(entity)

    const spyFindByIdRepoMethod = jest.spyOn(repository, 'findById')
    const output = await useCase.execute({ id: entity.id })

    expect(output).toStrictEqual({
      id: entity.id,
      created_at: entity.createdAt,
      name: 'test',
      is_active: true,
      description: null,
    })
    expect(spyFindByIdRepoMethod).toHaveBeenCalledTimes(1)
  })

  it('should throws an error when not found an category with inexistent id ', async () => {
    const spyFindByIdRepoMethod = jest.spyOn(repository, 'findById')

    expect(async () => {
      await useCase.execute({ id: 'someInexistentId' })
    }).rejects.toThrow(NotFoundError)
    expect(spyFindByIdRepoMethod).toHaveBeenCalledTimes(1)
  })
})
