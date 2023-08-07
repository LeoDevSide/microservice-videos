import { Module } from '@nestjs/common'
import { GenresController } from './genres.controller'
import { GENRE_PROVIDERS } from './genres.providers'
import { DatabaseModule } from '../database/database.module'
@Module({
  controllers: [GenresController],
  imports: [DatabaseModule],
  providers: [
    ...Object.values(GENRE_PROVIDERS.REPOSITORIES),
    ...Object.values(GENRE_PROVIDERS.USE_CASES),
  ],
})
export class GenresModule {}
