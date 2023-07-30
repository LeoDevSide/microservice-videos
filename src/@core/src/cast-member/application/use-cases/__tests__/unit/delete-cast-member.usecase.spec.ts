import { NotFoundError } from '../../../../../@shared/domain'
import { CastMemberFakeBuilder } from '../../../../domain'
import { InMemoryCastMemberRepository } from '../../../../infra/repository/in-memory/in-memory-cast-member.repository'
import { DeleteCastMemberUseCase } from '../../delete-cast-member.usecase'

describe('DeleteCastMemberUseCase Unit Tests', () => {
  let repository: InMemoryCastMemberRepository
  let useCase: DeleteCastMemberUseCase
  beforeEach(() => {
    repository = new InMemoryCastMemberRepository()
    useCase = new DeleteCastMemberUseCase(repository)
  })
  it('should delete an existent castMember by id ', async () => {
    const fakeCastMember = CastMemberFakeBuilder.aCastMember().build()
    await repository.insert(fakeCastMember)
    expect(repository.items.length).toBe(1)
    const spyDeleteRepoMethod = jest.spyOn(repository, 'delete')
    await useCase.execute({ id: fakeCastMember.id })
    expect(repository.items.length).toBe(0)
    expect(spyDeleteRepoMethod).toHaveBeenCalledTimes(1)
  })

  it('should throws an error when not found an castMember with inexistent id ', async () => {
    const spyDeleteRepoMethod = jest.spyOn(repository, 'findById')

    expect(async () => {
      await useCase.execute({ id: 'someInexistentId' })
    }).rejects.toThrow(NotFoundError)
    expect(spyDeleteRepoMethod).toHaveBeenCalledTimes(1)
  })
})
