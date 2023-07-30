import { Module } from '@nestjs/common'
import { CastMembersController } from './cast-members.controller'
import { CAST_MEMBER_PROVIDERS } from './cast-members.providers'
import { DatabaseModule } from '../database/database.module'

@Module({
  controllers: [CastMembersController],
  imports: [DatabaseModule],
  providers: [
    ...Object.values(CAST_MEMBER_PROVIDERS.REPOSITORIES),
    ...Object.values(CAST_MEMBER_PROVIDERS.USE_CASES),
  ],
})
export class CastMembersModule {}
