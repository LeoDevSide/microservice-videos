import { NotFoundError } from '../../../../../@shared/domain'
import { CastMemberFakeBuilder } from '../../../../domain'
import { InMemoryCastMemberRepository } from '../../../../infra/repository/in-memory/in-memory-cast-member.repository'
import { GetCastMemberUseCase } from '../../get-cast-member.usecase'

describe('GetCastMemberUseCase Unit Tests', () => {
  let repository: InMemoryCastMemberRepository
  let useCase: GetCastMemberUseCase
  beforeEach(() => {
    repository = new InMemoryCastMemberRepository()
    useCase = new GetCastMemberUseCase(repository)
  })
  it('should find an castMember with valid id', async () => {
    const fakeCastMember = CastMemberFakeBuilder.aCastMember().build()
    await repository.insert(fakeCastMember)

    const spyFindByIdRepoMethod = jest.spyOn(repository, 'findById')
    const output = await useCase.execute({ id: fakeCastMember.id })
    expect(output).toStrictEqual({
      id: fakeCastMember.id,
      created_at: fakeCastMember.createdAt,
      name: fakeCastMember.name,
      type: fakeCastMember.type,
    })
    expect(spyFindByIdRepoMethod).toHaveBeenCalledTimes(1)
  })

  it('should throws an error when not found an castMember with inexistent id ', async () => {
    const spyFindByIdRepoMethod = jest.spyOn(repository, 'findById')

    expect(async () => {
      await useCase.execute({ id: 'someInexistentId' })
    }).rejects.toThrow(NotFoundError)
    expect(spyFindByIdRepoMethod).toHaveBeenCalledTimes(1)
  })
})
