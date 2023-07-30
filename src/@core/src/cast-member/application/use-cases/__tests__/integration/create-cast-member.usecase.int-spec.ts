import { PrismaClient } from '@prisma/client'
import {
  CreateCastMemberInputDTO,
  CreateCastMemberUseCase,
} from '../../create-cast-member.usecase'
import { CastMemberType } from '../../../../domain'
import { PrismaCastMemberRepository } from '../../../../infra/repository/prisma/prisma-cast-member.repository'

describe('CreateCastMemberUseCase Integration Tests', () => {
  const prisma: PrismaClient = new PrismaClient()
  let repository: PrismaCastMemberRepository
  let useCase: CreateCastMemberUseCase
  beforeEach(async () => {
    repository = new PrismaCastMemberRepository(prisma)
    useCase = new CreateCastMemberUseCase(repository)
    await prisma.castMember.deleteMany()
  })
  afterAll(async () => prisma.$disconnect())
  it('should create a new castMember', async () => {
    const spyInsertRepoMethod = jest.spyOn(repository, 'insert')
    const input: CreateCastMemberInputDTO = {
      name: 'test',
      type: CastMemberType.ACTOR,
    }
    const output = await useCase.execute(input)
    const findAllDb = await prisma.castMember.findMany()
    expect(findAllDb.length).toBe(1)
    expect(output).toStrictEqual({
      id: findAllDb[0].id,
      created_at: findAllDb[0].created_at,
      name: 'test',
      type: CastMemberType.ACTOR,
    })
    expect(spyInsertRepoMethod).toHaveBeenCalledTimes(1)
  })

  it('should create a new castMember using optional inputs ', async () => {
    const spyInsertRepoMethod = jest.spyOn(repository, 'insert')
    const input: CreateCastMemberInputDTO = {
      name: 'test',
      type: CastMemberType.ACTOR,
    }
    const output = await useCase.execute(input)
    const findAllDb = await prisma.castMember.findMany()
    expect(findAllDb.length).toBe(1)
    expect(output).toStrictEqual({
      id: findAllDb[0].id,
      created_at: findAllDb[0].created_at,
      name: 'test',
      type: CastMemberType.ACTOR,
    })
    expect(spyInsertRepoMethod).toHaveBeenCalledTimes(1)
  })
})
