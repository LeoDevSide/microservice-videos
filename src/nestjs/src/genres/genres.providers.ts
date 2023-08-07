/* eslint-disable @typescript-eslint/no-namespace */
import {
  CreateGenreUseCase,
  DeleteGenreUseCase,
  FetchGenresUseCase,
  GetGenreUseCase,
  UpdateGenreUseCase,
} from '@me/micro-videos/src/genre/application'
import {
  IGenreRepository,
  InMemoryGenreRepository,
  PrismaGenreRepository,
} from '@me/micro-videos/src/genre/infra'
import { PrismaService } from '../database/prisma/prisma.service'

export namespace GENRE_PROVIDERS {
  export namespace REPOSITORIES {
    export const GENRE_IN_MEMORY_REPOSITORY = {
      provide: 'InMemoryGenreRepository',
      useClass: InMemoryGenreRepository,
    }
    export const GENRE_PRISMA_REPOSITORY = {
      provide: 'PrismaGenreRepository',
      useFactory: (prisma: PrismaService) => {
        return new PrismaGenreRepository(prisma)
      },
      inject: [PrismaService],
    }

    export const GENRE_REPOSITORY = {
      provide: 'GenreRepository',
      useExisting: 'PrismaGenreRepository',
    }
  }
  export namespace USE_CASES {
    export const CREATE_GENRE_USE_CASE = {
      provide: CreateGenreUseCase,
      useFactory: (genreRepository: IGenreRepository) => {
        return new CreateGenreUseCase(genreRepository)
      },
      inject: [REPOSITORIES.GENRE_REPOSITORY.provide],
    }
    export const FETCH_GENRES_USE_CASE = {
      provide: FetchGenresUseCase,
      useFactory: (genreRepository: IGenreRepository) => {
        return new FetchGenresUseCase(genreRepository)
      },
      inject: [REPOSITORIES.GENRE_REPOSITORY.provide],
    }
    export const UPDATE_GENRE_USE_CASE = {
      provide: UpdateGenreUseCase,
      useFactory: (genreRepository: IGenreRepository) => {
        return new UpdateGenreUseCase(genreRepository)
      },
      inject: [REPOSITORIES.GENRE_REPOSITORY.provide],
    }
    export const GET_GENRE_USE_CASE = {
      provide: GetGenreUseCase,
      useFactory: (genreRepository: IGenreRepository) => {
        return new GetGenreUseCase(genreRepository)
      },
      inject: [REPOSITORIES.GENRE_REPOSITORY.provide],
    }
    export const DELETE_GENRE_USE_CASE = {
      provide: DeleteGenreUseCase,
      useFactory: (genreRepository: IGenreRepository) => {
        return new DeleteGenreUseCase(genreRepository)
      },
      inject: [REPOSITORIES.GENRE_REPOSITORY.provide],
    }
  }
}
