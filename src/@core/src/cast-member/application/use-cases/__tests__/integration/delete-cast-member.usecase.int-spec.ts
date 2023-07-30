import { PrismaClient } from '@prisma/client'
import { NotFoundError } from '../../../../../@shared/domain'
import { CastMemberFakeBuilder } from '../../../../domain'
import { PrismaCastMemberRepository } from '../../../../infra/repository/prisma/prisma-cast-member.repository'
import { DeleteCastMemberUseCase } from '../../delete-cast-member.usecase'

describe('DeleteCastMemberUseCase Unit Tests', () => {
  const prisma = new PrismaClient()
  let repository: PrismaCastMemberRepository
  let useCase: DeleteCastMemberUseCase
  beforeEach(async () => {
    repository = new PrismaCastMemberRepository(prisma)
    useCase = new DeleteCastMemberUseCase(repository)
    await prisma.castMember.deleteMany()
  })
  it('should delete an castMember', async () => {
    const entity = CastMemberFakeBuilder.aCastMember().build()
    await repository.insert(entity)

    const spyDeleteRepoMethod = jest.spyOn(repository, 'delete')
    await useCase.execute({
      id: entity.id,
    })

    expect(spyDeleteRepoMethod).toHaveBeenCalledTimes(1)

    const fromDb = await repository.findAll()
    expect(fromDb.length).toBe(0)
  })

  it('should not delete an not found cast-member and throws a error', async () => {
    const spyMethod = jest.spyOn(repository, 'delete')

    const input = {
      id: 'inexistent',
    }

    expect(async () => {
      await useCase.execute(input)
    }).rejects.toThrow(NotFoundError)

    expect(spyMethod).toHaveBeenCalledTimes(0)
  })
})
