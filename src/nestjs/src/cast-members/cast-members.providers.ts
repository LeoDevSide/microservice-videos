/* eslint-disable @typescript-eslint/no-namespace */
import {
  CreateCastMemberUseCase,
  DeleteCastMemberUseCase,
  FetchCastMembersUseCase,
  GetCastMemberUseCase,
  UpdateCastMemberUseCase,
} from '@me/micro-videos/src/cast-member/application'
import {
  ICastMemberRepository,
  InMemoryCastMemberRepository,
  PrismaCastMemberRepository,
} from '@me/micro-videos/src/cast-member/infra'
import { PrismaService } from '../database/prisma/prisma.service'

export namespace CAST_MEMBER_PROVIDERS {
  export namespace REPOSITORIES {
    export const CAST_MEMBER_IN_MEMORY_REPOSITORY = {
      provide: 'InMemoryCastMemberRepository',
      useClass: InMemoryCastMemberRepository,
    }
    export const CAST_MEMBER_PRISMA_REPOSITORY = {
      provide: 'PrismaCastMemberRepository',
      useFactory: (prisma: PrismaService) => {
        return new PrismaCastMemberRepository(prisma)
      },
      inject: [PrismaService],
    }

    export const CAST_MEMBER_REPOSITORY = {
      provide: 'CastMemberRepository',
      useExisting: 'PrismaCastMemberRepository',
    }
  }
  export namespace USE_CASES {
    export const CREATE_CAST_MEMBER_USE_CASE = {
      provide: CreateCastMemberUseCase,
      useFactory: (castMemberRepository: ICastMemberRepository) => {
        return new CreateCastMemberUseCase(castMemberRepository)
      },
      inject: [REPOSITORIES.CAST_MEMBER_REPOSITORY.provide],
    }
    export const FETCH_CAST_MEMBERS_USE_CASE = {
      provide: FetchCastMembersUseCase,
      useFactory: (castMemberRepository: ICastMemberRepository) => {
        return new FetchCastMembersUseCase(castMemberRepository)
      },
      inject: [REPOSITORIES.CAST_MEMBER_REPOSITORY.provide],
    }
    export const UPDATE_CAST_MEMBER_USE_CASE = {
      provide: UpdateCastMemberUseCase,
      useFactory: (castMemberRepository: ICastMemberRepository) => {
        return new UpdateCastMemberUseCase(castMemberRepository)
      },
      inject: [REPOSITORIES.CAST_MEMBER_REPOSITORY.provide],
    }
    export const GET_CAST_MEMBER_USE_CASE = {
      provide: GetCastMemberUseCase,
      useFactory: (castMemberRepository: ICastMemberRepository) => {
        return new GetCastMemberUseCase(castMemberRepository)
      },
      inject: [REPOSITORIES.CAST_MEMBER_REPOSITORY.provide],
    }
    export const DELETE_CAST_MEMBER_USE_CASE = {
      provide: DeleteCastMemberUseCase,
      useFactory: (castMemberRepository: ICastMemberRepository) => {
        return new DeleteCastMemberUseCase(castMemberRepository)
      },
      inject: [REPOSITORIES.CAST_MEMBER_REPOSITORY.provide],
    }
  }
}
