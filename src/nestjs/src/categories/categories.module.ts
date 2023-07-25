import { Module } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { CategoriesController } from './categories.controller'
import { CATEGORY_PROVIDERS } from './categories.providers'
import { DatabaseModule } from '../database/database.module'

@Module({
  controllers: [CategoriesController],
  imports: [DatabaseModule],
  providers: [
    CategoriesService,
    ...Object.values(CATEGORY_PROVIDERS.REPOSITORIES),
    ...Object.values(CATEGORY_PROVIDERS.USE_CASES),
  ],
})
export class CategoriesModule {}
