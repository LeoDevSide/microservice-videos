import { Test } from '@nestjs/testing'
import { CastMembersController } from '../../cast-members.controller'
import { DatabaseModule } from '../../../database/database.module'
import { CastMembersModule } from '../../cast-members.module'
import {
  CreateCastMemberUseCase,
  FetchCastMembersUseCase,
  GetCastMemberUseCase,
  UpdateCastMemberUseCase,
  DeleteCastMemberUseCase,
} from '@me/micro-videos/src/cast-member/application'
import { CreateCastMemberDto } from '../../dto/create-cast-member.dto'
import { ICastMemberRepository } from '@me/micro-videos/src/cast-member/infra'
import { CAST_MEMBER_PROVIDERS } from '../../cast-members.providers'
import { UpdateCastMemberDto } from '../../dto/update-cast-member.dto'
import {
  CastMemberEntity,
  CastMemberFakeBuilder,
  CastMemberType,
} from '@me/micro-videos/src/cast-member/domain'
import { SearchCastMembersDTO } from '../../dto/search-cast-members.dto'
import { PrismaService } from '../../../database/prisma/prisma.service'
import {
  CastMemberCollectionPresenter,
  CastMemberPresenter,
} from '../../presenter/cast-members.presenter'

describe('CastMembersController Integration Tests', () => {
  let controller: CastMembersController
  let repository: ICastMemberRepository
  const db: PrismaService = new PrismaService()
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [DatabaseModule, CastMembersModule],
    }).compile()

    controller = module.get<CastMembersController>(CastMembersController)
    repository = module.get(
      CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
    )
    await db.castMember.deleteMany()
  })
  it('Should be defined', () => {
    expect(controller).toBeDefined()
    expect(controller['createCastMemberUseCase']).toBeInstanceOf(
      CreateCastMemberUseCase,
    )
    expect(controller['fetchCastMembersUseCase']).toBeInstanceOf(
      FetchCastMembersUseCase,
    )
    expect(controller['getCastMemberUseCase']).toBeInstanceOf(
      GetCastMemberUseCase,
    )
    expect(controller['updateCastMemberUseCase']).toBeInstanceOf(
      UpdateCastMemberUseCase,
    )
    expect(controller['deleteCastMemberUseCase']).toBeInstanceOf(
      DeleteCastMemberUseCase,
    )
    expect(controller['create'])
  })

  it('should create a castMember', async () => {
    const input: CreateCastMemberDto = {
      name: 'test',
      type: CastMemberType.ACTOR,
    }

    const presenter = await controller.create(input)
    expect(presenter.created_at).toBeDefined()
    expect(presenter.id).toBeDefined()
    expect(presenter.name).toBe(input.name)
    expect(presenter.type).toBe(input.type)
    expect(presenter.created_at).toBeInstanceOf(Date)
    expect(presenter).toBeInstanceOf(CastMemberPresenter)

    const entityFromDb = await repository.findById(presenter.id)

    expect(entityFromDb.id).toStrictEqual(presenter.id)
    expect(entityFromDb.createdAt).toStrictEqual(presenter.created_at)
  })

  it('should update a castMember', async () => {
    const input: UpdateCastMemberDto = {
      name: 'test',
      type: CastMemberType.ACTOR,
    }
    const entity = new CastMemberEntity({
      name: 'initial name',
      type: CastMemberType.ACTOR,
    })
    await repository.insert(entity)

    const presenter = await controller.update(entity.id, input)
    expect(presenter.created_at).toBeDefined()
    expect(presenter.id).toBe(entity.id)
    expect(presenter.name).toBe(input.name)
    expect(presenter.type).toBe(input.type)

    expect(presenter.created_at).toStrictEqual(entity.createdAt)
    expect(presenter).toBeInstanceOf(CastMemberPresenter)

    const entityFromDb = await repository.findById(presenter.id)

    expect(entityFromDb.id).toStrictEqual(presenter.id)
    expect(entityFromDb.createdAt).toStrictEqual(presenter.created_at)
    expect(entityFromDb.toJSON()).toMatchObject(presenter)
  })
  describe('search method', () => {
    it('should fetch castMembers using query empty sorted by created_at', async () => {
      const castMembers = CastMemberFakeBuilder.theCastMembers(4)
        .withName((index) => index + 'name')
        .withCreatedAt((index) => new Date(new Date().getTime() + index))
        .build()
      await repository.bulkInsert(castMembers)

      const arrange: { sendData: SearchCastMembersDTO; expected: any }[] = [
        {
          sendData: {},
          expected: new CastMemberCollectionPresenter({
            items: [
              castMembers[3].toJSON(),
              castMembers[2].toJSON(),
              castMembers[1].toJSON(),
              castMembers[0].toJSON(),
            ],
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 4,
          }),
        },
        {
          sendData: { per_page: 2, page: 1 },
          expected: new CastMemberCollectionPresenter({
            items: [castMembers[3].toJSON(), castMembers[2].toJSON()],
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
    it('should fetch castMembers using query with filter name', async () => {
      const castMember = CastMemberFakeBuilder.aCastMember()
      const castMembers = [
        castMember.withName('a').build(),
        castMember.withName('AAA').build(),
        castMember.withName('AaA').build(),
        castMember.withName('b').build(),
        castMember.withName('c').build(),
      ]
      await repository.bulkInsert(castMembers)

      const arrange: { sendData: SearchCastMembersDTO; expected: any }[] = [
        {
          sendData: {
            page: 1,
            per_page: 2,
            sort: 'name',
            filter: { name: 'a' },
          },
          expected: new CastMemberCollectionPresenter({
            items: [castMembers[0].toJSON(), castMembers[2].toJSON()],
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
            filter: { name: 'a' },
          },
          expected: new CastMemberCollectionPresenter({
            items: [castMembers[1].toJSON()],
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

    it('should fetch castMembers using query with filter type', async () => {
      const castMember = CastMemberFakeBuilder.aCastMember()
      const castMembers = [
        castMember.withName('name 0').withType(1).build(),
        castMember.withName('name 1').withType(2).build(),
        castMember.withName('name 2').withType(2).build(),
        castMember.withName('name 3').withType(1).build(),
        castMember.withName('name 4').withType(1).build(),
      ]
      await repository.bulkInsert(castMembers)

      const arrange: { sendData: SearchCastMembersDTO; expected: any }[] = [
        {
          sendData: {
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: { type: 1 },
          },
          expected: new CastMemberCollectionPresenter({
            items: [castMembers[0].toJSON(), castMembers[3].toJSON()],
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
            filter: { type: 1 },
          },
          expected: new CastMemberCollectionPresenter({
            items: [castMembers[0].toJSON()],
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

    it('should fetch castMembers using query with sort props', async () => {
      const castMember = CastMemberFakeBuilder.aCastMember()
      const castMembers = [
        castMember.withName('a1').build(),
        castMember.withName('a2').build(),
        castMember.withName('a3').build(),
        castMember.withName('a4').build(),
        castMember.withName('a5').build(),
      ]
      await repository.bulkInsert(castMembers)

      const arrange: { sendData: SearchCastMembersDTO; expected: any }[] = [
        {
          sendData: {
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
          },
          expected: new CastMemberCollectionPresenter({
            items: [castMembers[4].toJSON(), castMembers[3].toJSON()],
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
          expected: new CastMemberCollectionPresenter({
            items: [castMembers[2].toJSON(), castMembers[3].toJSON()],
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

  it('should get a castMember', async () => {
    const entity = new CastMemberEntity({
      name: 'initial name',
      type: CastMemberType.ACTOR,
    })
    const input = entity.id
    await repository.insert(entity)

    const presenter = await controller.findOne(input)
    expect(presenter.created_at).toBeDefined()
    expect(presenter.id).toBe(entity.id)
    expect(presenter.name).toBe(entity.name)
    expect(presenter.type).toBe(entity.type)
    expect(presenter.created_at).toStrictEqual(entity.createdAt)
    expect(presenter).toBeInstanceOf(CastMemberPresenter)
  })
})
